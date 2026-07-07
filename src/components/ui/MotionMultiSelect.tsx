'use client'
// OPFOR motion MultiSelect — fuses the beui motion Select panel animation with the motion
// Checkbox rows. A pill trigger ("{label} (n of m)") opens a portaled, spring-animated panel
// (escapes chart/table overflow) with Select-all / Clear-all and a greyscale MotionCheckbox
// per option. Greyscale checks (not red) by design. Reduced-motion aware.

import { motion, useReducedMotion, type Transition } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { Checkbox } from '@/components/ui/MotionCheckbox'
import { cn } from '@/lib/utils'

const EASE_OUT = [0.16, 1, 0.3, 1] as const

export interface MultiSelectOption {
  value: string
  label: string
  /** Optional accent colour for a left border (e.g. the per-country chart series colour). */
  accent?: string
}

export interface MotionMultiSelectProps {
  label: string
  options: MultiSelectOption[]
  selected: Set<string>
  onChange: (next: Set<string>) => void
  icon?: ReactNode
  /** Extra classes for the trigger pill. */
  className?: string
  /** Panel min-width (px). Defaults to 224 (min-w-56). */
  minWidth?: number
}

export function MotionMultiSelect({
  label,
  options,
  selected,
  onChange,
  icon,
  className,
  minWidth = 224,
}: MotionMultiSelectProps) {
  const reduce = useReducedMotion()
  const baseId = useId()
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const [coords, setCoords] = useState<{ left: number; width: number; top?: number; bottom?: number }>({ left: 0, width: 0 })

  // Measure the panel's natural height for the spring open/close.
  useLayoutEffect(() => {
    const node = innerRef.current
    if (!node) return
    const measure = () => setHeight(node.offsetHeight)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // Position the portaled panel from the trigger rect; flip up when tight.
  useLayoutEffect(() => {
    if (!open) return
    const compute = () => {
      const trigger = triggerRef.current
      const node = innerRef.current
      if (!trigger || !node) return
      const rect = trigger.getBoundingClientRect()
      const h = node.offsetHeight
      const below = window.innerHeight - rect.bottom
      const above = rect.top
      const flipUp = below < h + 16 && above > below
      setCoords(flipUp
        ? { left: rect.left, width: rect.width, bottom: window.innerHeight - rect.top }
        : { left: rect.left, width: rect.width, top: rect.bottom })
    }
    compute()
    const onReflow = () => compute()
    window.addEventListener('scroll', onReflow, true)
    window.addEventListener('resize', onReflow)
    return () => {
      window.removeEventListener('scroll', onReflow, true)
      window.removeEventListener('resize', onReflow)
    }
  }, [open])

  // Close on Escape / outside click (panel is portaled, so check both refs).
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node
      if (!triggerRef.current?.contains(t) && !panelRef.current?.contains(t)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  const isTop = coords.bottom !== undefined
  const toggle = useCallback((value: string) => {
    const next = new Set(selected)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    onChange(next)
  }, [selected, onChange])

  const gapT: Transition = open
    ? { type: 'spring', duration: 0.6, bounce: 0.5, delay: 0.1 }
    : { type: 'spring', duration: 0.3, bounce: 0.1 }

  const panel = (
    <motion.div
      ref={panelRef}
      id={`${baseId}-panel`}
      role="listbox"
      aria-multiselectable
      aria-hidden={!open}
      inert={!open ? true : undefined}
      initial={false}
      animate={
        reduce
          ? { opacity: open ? 1 : 0, height: open ? height : 0 }
          : {
              opacity: open ? 1 : 0,
              height: open ? height : 0,
              marginTop: isTop ? 0 : (open ? 8 : 0),
              marginBottom: isTop ? (open ? 8 : 0) : 0,
            }
      }
      transition={
        reduce
          ? { duration: 0.12 }
          : {
              opacity: open ? { duration: 0.18 } : { duration: 0.16, delay: 0.1 },
              height: open
                ? { type: 'spring', duration: 0.42, bounce: 0.14 }
                : { duration: 0.24, ease: EASE_OUT, delay: 0.1 },
              marginTop: isTop ? { duration: 0 } : gapT,
              marginBottom: isTop ? gapT : { duration: 0 },
            }
      }
      style={{
        position: 'fixed',
        left: coords.left,
        minWidth: Math.max(minWidth, coords.width),
        ...(isTop ? { bottom: coords.bottom } : { top: coords.top }),
        transformOrigin: isTop ? 'bottom' : 'top',
        overflow: 'hidden',
        pointerEvents: open ? 'auto' : 'none',
        zIndex: 9999,
      }}
      className="rounded-lg border border-border bg-surface-2 shadow-xl"
    >
      <div ref={innerRef}>
        <div className="flex gap-2 p-2 border-b border-border">
          <button
            type="button"
            onClick={() => onChange(new Set(options.map(o => o.value)))}
            className="px-2.5 py-1 text-[11px] font-semibold rounded-md border border-border bg-surface hover:bg-elevated text-text-2 hover:text-fg transition-colors"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={() => onChange(new Set())}
            className="px-2.5 py-1 text-[11px] font-semibold rounded-md border border-border bg-surface hover:bg-elevated text-text-2 hover:text-fg transition-colors"
          >
            Clear All
          </button>
        </div>
        <div className="max-h-72 overflow-y-auto p-1">
          {options.map(opt => (
            <div
              key={opt.value}
              className="rounded hover:bg-surface transition-colors"
              style={opt.accent ? { borderLeft: `2px solid ${opt.accent}` } : undefined}
            >
              <Checkbox
                size="sm"
                checked={selected.has(opt.value)}
                onCheckedChange={() => toggle(opt.value)}
                label={opt.label}
                labelClassName="text-[11px] text-text-2"
                className="w-full px-2 py-1"
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )

  return (
    <>
      <motion.button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${baseId}-panel`}
        whileTap={reduce ? undefined : { scale: 0.97 }}
        onClick={() => setOpen(o => !o)}
        className={cn(
          'flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-lg border border-border bg-surface hover:bg-surface-2 text-text-2 hover:text-fg shadow-sm transition-colors',
          className,
        )}
      >
        {icon}
        <span>{label} ({selected.size} of {options.length})</span>
        <motion.span aria-hidden animate={{ rotate: open ? 180 : 0 }} transition={{ type: 'spring', duration: 0.4, bounce: 0.3 }} className="text-text-3">
          <ChevronDown size={11} />
        </motion.span>
      </motion.button>
      {typeof document !== 'undefined' ? createPortal(panel, document.body) : null}
    </>
  )
}
