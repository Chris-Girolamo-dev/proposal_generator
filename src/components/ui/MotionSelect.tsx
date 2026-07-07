'use client'
// OPFOR motion Select — adapted from beui.dev/components/motion/select to the OPFOR
// design system (framer-motion + design tokens). Composable: Select / SelectTrigger /
// SelectValue / SelectContent / SelectItem. The panel "pinches" off the trigger with a
// spring radius animation and staggers its items in. Position-aware (opens up when tight).

import { Check, ChevronDown } from 'lucide-react'
import { createPortal } from 'react-dom'
import {
  motion,
  type Transition,
  useReducedMotion,
  type Variants,
} from 'framer-motion'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { cn } from '@/lib/utils'

const EASE_OUT = [0.16, 1, 0.3, 1] as const
const CHEVRON_TRANSITION: Transition = { type: 'spring', duration: 0.4, bounce: 0.3 }

const LIST_VARIANTS: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } },
}
const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: -6, filter: 'blur(3px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

type Placement = 'bottom' | 'top'

interface SelectContextValue {
  value: string | undefined
  open: boolean
  setOpen: (open: boolean) => void
  select: (value: string) => void
  register: (value: string, label: string, disabled?: boolean) => void
  unregister: (value: string) => void
  labelFor: (value: string | undefined) => string | undefined
  disabledValues: Set<string>
  reduce: boolean
  triggerId: string
  listId: string
  disabled: boolean
  placement: Placement
  setPlacement: (p: Placement) => void
  // When true, the panel is rendered through a portal to document.body with fixed
  // positioning (escapes table/toolbar overflow clipping). Opt-in — the composable
  // in-flow usage (e.g. Dose Randomization) keeps absolute positioning.
  portal: boolean
  // Keyboard roving: the highlighted option (focus stays on the trigger, ARIA combobox pattern).
  activeValue: string | undefined
  setActiveValue: (v: string | undefined) => void
  orderedValues: string[]
  optionId: (v: string) => string
}

const SelectContext = createContext<SelectContextValue | null>(null)

function useSelectContext(component: string) {
  const ctx = useContext(SelectContext)
  if (!ctx) throw new Error(`${component} must be used within <Select>`)
  return ctx
}

export interface SelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  className?: string
  /** Portal the panel to document.body (escapes table/toolbar overflow clipping). */
  portal?: boolean
  /** Start opened (for inline table-cell editing — open immediately on mount). */
  defaultOpen?: boolean
  /** Notified whenever the open state changes (used by the inline-edit wrapper). */
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

export function Select({
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  className,
  portal = false,
  defaultOpen = false,
  onOpenChange,
  children,
}: SelectProps) {
  const reduce = useReducedMotion() ?? false
  const baseId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpenState] = useState(defaultOpen)
  // Wrap the open setter so every change (select, escape, outside-click, trigger
  // toggle) notifies onOpenChange — the inline-edit wrapper needs the close signal.
  const setOpen = useCallback(
    (next: boolean) => {
      setOpenState(next)
      onOpenChange?.(next)
    },
    [onOpenChange],
  )
  const [internal, setInternal] = useState(defaultValue)
  const [labels, setLabels] = useState<Map<string, string>>(new Map())
  const [disabledValues, setDisabledValues] = useState<Set<string>>(new Set())
  const [placement, setPlacement] = useState<Placement>('bottom')
  const [activeValue, setActiveValue] = useState<string | undefined>(undefined)

  const controlled = value !== undefined
  const current = controlled ? value : internal
  const orderedValues = useMemo(() => Array.from(labels.keys()), [labels])
  const optionId = useCallback((v: string) => `${baseId}-opt-${v}`, [baseId])

  // Highlight the current value when opening; clear on close (ARIA combobox roving).
  useEffect(() => { setActiveValue(open ? current : undefined) }, [open, current])

  const select = useCallback(
    (next: string) => {
      if (disabledValues.has(next)) return // never select a disabled option (keyboard or click)
      if (!controlled) setInternal(next)
      onValueChange?.(next)
      setOpen(false)
    },
    [controlled, onValueChange, setOpen, disabledValues],
  )

  const register = useCallback((v: string, label: string, disabled?: boolean) => {
    setLabels((m) => (m.get(v) === label ? m : new Map(m).set(v, label)))
    setDisabledValues((s) => {
      const has = s.has(v)
      if (disabled && !has) { const n = new Set(s); n.add(v); return n }
      if (!disabled && has) { const n = new Set(s); n.delete(v); return n }
      return s
    })
  }, [])

  const unregister = useCallback((v: string) => {
    setLabels((m) => {
      if (!m.has(v)) return m
      const next = new Map(m)
      next.delete(v)
      return next
    })
    setDisabledValues((s) => {
      if (!s.has(v)) return s
      const n = new Set(s); n.delete(v); return n
    })
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node
      // In portal mode the panel lives in document.body (outside rootRef), so also
      // treat clicks inside the portaled listbox as "inside".
      const list = document.getElementById(`${baseId}-list`)
      if (
        rootRef.current && !rootRef.current.contains(target) &&
        !(list && list.contains(target))
      ) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [open, baseId, setOpen])

  const ctx = useMemo<SelectContextValue>(
    () => ({
      value: current,
      open,
      setOpen,
      select,
      register,
      unregister,
      labelFor: (v) => (v === undefined ? undefined : labels.get(v)),
      disabledValues,
      reduce,
      triggerId: `${baseId}-trigger`,
      listId: `${baseId}-list`,
      disabled,
      placement,
      setPlacement,
      portal,
      activeValue,
      setActiveValue,
      orderedValues,
      optionId,
    }),
    [current, open, setOpen, select, register, unregister, labels, disabledValues, reduce, baseId, disabled, placement, portal, activeValue, orderedValues, optionId],
  )

  return (
    <SelectContext.Provider value={ctx}>
      <div ref={rootRef} className={cn('relative', className)}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export interface SelectTriggerProps {
  className?: string
  /** Focus the trigger on mount (inline table-cell editing — enables keyboard nav immediately). */
  autoFocus?: boolean
  children: ReactNode
}

export function SelectTrigger({ className, autoFocus, children }: SelectTriggerProps) {
  const ctx = useSelectContext('SelectTrigger')
  const btnRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (autoFocus) btnRef.current?.focus()
  }, [autoFocus])
  const isTop = ctx.placement === 'top'
  const kf = ctx.open ? [0, 0, 10] : [10, 0, 10]
  const kfT: Transition = ctx.reduce
    ? { duration: 0 }
    : ctx.open
      ? { duration: 0.6, times: [0, 0.4, 1], ease: EASE_OUT }
      : { duration: 0.42, times: [0, 0.5, 1], ease: EASE_OUT }
  const flatT: Transition = { duration: 0 }

  return (
    <motion.button
      ref={btnRef}
      type="button"
      id={ctx.triggerId}
      disabled={ctx.disabled}
      aria-haspopup="listbox"
      aria-expanded={ctx.open}
      aria-controls={ctx.listId}
      aria-activedescendant={ctx.open && ctx.activeValue ? ctx.optionId(ctx.activeValue) : undefined}
      onClick={() => ctx.setOpen(!ctx.open)}
      onKeyDown={(e) => {
        if (ctx.disabled) return
        // Roving nav only lands on enabled options; select() also guards disabled.
        const enabled = ctx.orderedValues.filter((v) => !ctx.disabledValues.has(v))
        const idx = ctx.activeValue ? enabled.indexOf(ctx.activeValue) : -1
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault()
            if (!ctx.open) ctx.setOpen(true)
            else ctx.setActiveValue(enabled[Math.min(idx + 1, enabled.length - 1)] ?? enabled[0])
            break
          case 'ArrowUp':
            e.preventDefault()
            if (!ctx.open) ctx.setOpen(true)
            else ctx.setActiveValue(enabled[Math.max(idx - 1, 0)] ?? enabled[0])
            break
          case 'Home':
            if (ctx.open) { e.preventDefault(); ctx.setActiveValue(enabled[0]) }
            break
          case 'End':
            if (ctx.open) { e.preventDefault(); ctx.setActiveValue(enabled[enabled.length - 1]) }
            break
          case 'Enter':
          case ' ':
            e.preventDefault()
            if (ctx.open && ctx.activeValue) ctx.select(ctx.activeValue)
            else ctx.setOpen(!ctx.open)
            break
        }
      }}
      initial={false}
      animate={{
        borderTopLeftRadius: isTop ? kf : 10,
        borderTopRightRadius: isTop ? kf : 10,
        borderBottomLeftRadius: isTop ? 10 : kf,
        borderBottomRightRadius: isTop ? 10 : kf,
      }}
      transition={{
        borderTopLeftRadius: isTop ? kfT : flatT,
        borderTopRightRadius: isTop ? kfT : flatT,
        borderBottomLeftRadius: isTop ? flatT : kfT,
        borderBottomRightRadius: isTop ? flatT : kfT,
      }}
      className={cn(
        'relative z-10 flex w-full items-center justify-between gap-2 border border-border bg-canvas px-3 py-2 text-sm text-fg outline-none transition-colors',
        'hover:border-border-2 focus-visible:ring-2 focus-visible:ring-red/40',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
    >
      {children}
      <motion.span
        aria-hidden
        animate={{ rotate: ctx.open ? 180 : 0 }}
        transition={ctx.reduce ? { duration: 0 } : CHEVRON_TRANSITION}
        className="text-text-3"
      >
        <ChevronDown className="h-4 w-4" />
      </motion.span>
    </motion.button>
  )
}

export interface SelectValueProps {
  placeholder?: string
  className?: string
}

export function SelectValue({ placeholder, className }: SelectValueProps) {
  const ctx = useSelectContext('SelectValue')
  const label = ctx.labelFor(ctx.value)
  // Fall back to the raw value (not the placeholder) when it has no registered option
  // — e.g. a filter is still set to a kit/label that left the dataset; show it's active.
  const display = label ?? ctx.value ?? placeholder ?? 'Select'
  return (
    <span className={cn('truncate', label || ctx.value ? 'text-fg' : 'text-text-3', className)}>
      {display}
    </span>
  )
}

export interface SelectContentProps {
  className?: string
  children: ReactNode
}

export function SelectContent({ className, children }: SelectContentProps) {
  const ctx = useSelectContext('SelectContent')
  const innerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  // Fixed coords for portal mode (computed from the trigger rect on open + scroll/resize).
  const [coords, setCoords] = useState<{ left: number; width: number; top?: number; bottom?: number }>({ left: 0, width: 0 })
  const open = ctx.open
  const { setPlacement, portal } = ctx

  useLayoutEffect(() => {
    const node = innerRef.current
    if (!node) return
    const measure = () => setHeight(node.offsetHeight)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
    // Set up once; the ResizeObserver handles subsequent size changes (no re-create per render).
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    const node = innerRef.current
    const compute = () => {
      const trigger = document.getElementById(ctx.triggerId)
      if (!trigger || !node) return
      const rect = trigger.getBoundingClientRect()
      const h = node.offsetHeight
      const below = window.innerHeight - rect.bottom
      const above = rect.top
      const top = below < h + 16 && above > below
      setPlacement(top ? 'top' : 'bottom')
      if (portal) {
        setCoords(top
          ? { left: rect.left, width: rect.width, bottom: window.innerHeight - rect.top }
          : { left: rect.left, width: rect.width, top: rect.bottom })
      }
    }
    compute()
    if (!portal) return
    const onReflow = () => compute()
    window.addEventListener('scroll', onReflow, true)
    window.addEventListener('resize', onReflow)
    return () => {
      window.removeEventListener('scroll', onReflow, true)
      window.removeEventListener('resize', onReflow)
    }
  }, [open, ctx.triggerId, setPlacement, portal])

  const isTop = ctx.placement === 'top'
  const nearGap = open ? 8 : 0
  const nearRadius = open ? 10 : 0

  const gapT: Transition = open
    ? { type: 'spring', duration: 0.6, bounce: 0.5, delay: 0.12 }
    : { type: 'spring', duration: 0.3, bounce: 0.1 }
  const radiusT: Transition = open
    ? { duration: 0.3, ease: EASE_OUT, delay: 0.14 }
    : { duration: 0.16, ease: EASE_OUT }
  const instant: Transition = { duration: 0 }

  // Positioning differs by mode: portal = fixed coords from the trigger rect (escapes
  // overflow clipping); in-flow = absolute, stretched to the trigger width.
  const positionStyle: React.CSSProperties = portal
    ? {
        position: 'fixed',
        left: coords.left,
        minWidth: coords.width,
        ...(isTop ? { bottom: coords.bottom } : { top: coords.top }),
        zIndex: 9999,
      }
    : {}

  const panel = (
    <motion.div
      id={ctx.listId}
      role="listbox"
      aria-labelledby={ctx.triggerId}
      aria-hidden={!open}
      aria-activedescendant={open && ctx.activeValue ? ctx.optionId(ctx.activeValue) : undefined}
      inert={!open ? true : undefined}
      initial={false}
      animate={
        ctx.reduce
          ? { opacity: open ? 1 : 0, height: open ? height : 0 }
          : {
              opacity: open ? 1 : 0,
              height: open ? height : 0,
              marginTop: isTop ? 0 : nearGap,
              marginBottom: isTop ? nearGap : 0,
              borderTopLeftRadius: isTop ? 10 : nearRadius,
              borderTopRightRadius: isTop ? 10 : nearRadius,
              borderBottomLeftRadius: isTop ? nearRadius : 10,
              borderBottomRightRadius: isTop ? nearRadius : 10,
            }
      }
      transition={
        ctx.reduce
          ? { duration: 0.12 }
          : {
              opacity: open ? { duration: 0.18 } : { duration: 0.16, delay: 0.12 },
              height: open
                ? { type: 'spring', duration: 0.42, bounce: 0.14 }
                : { duration: 0.26, ease: EASE_OUT, delay: 0.14 },
              marginTop: isTop ? instant : gapT,
              marginBottom: isTop ? gapT : instant,
              borderTopLeftRadius: isTop ? instant : radiusT,
              borderTopRightRadius: isTop ? instant : radiusT,
              borderBottomLeftRadius: isTop ? radiusT : instant,
              borderBottomRightRadius: isTop ? radiusT : instant,
            }
      }
      style={{
        ...positionStyle,
        transformOrigin: isTop ? 'bottom' : 'top',
        overflow: 'hidden',
        pointerEvents: open ? 'auto' : 'none',
      }}
      className={cn(
        'border border-border bg-surface-2 shadow-lg',
        portal ? '' : cn('absolute left-0 right-0 z-20', isTop ? 'bottom-full' : 'top-full'),
        className,
      )}
    >
      <motion.div
        ref={innerRef}
        variants={ctx.reduce ? undefined : LIST_VARIANTS}
        initial={false}
        animate={open ? 'show' : 'hidden'}
        className="p-1"
      >
        {children}
      </motion.div>
    </motion.div>
  )

  if (portal && typeof document !== 'undefined') {
    return createPortal(panel, document.body)
  }
  return panel
}

// Drop-in convenience wrapper matching the legacy CustomSelect API
// (value / options / onChange / className / fullWidth) so standalone dropdowns can
// adopt the motion Select with a one-line swap, no per-call-site restructuring.
export interface SimpleSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SimpleSelectProps {
  value: string
  options: SimpleSelectOption[]
  onChange: (value: string) => void
  className?: string
  fullWidth?: boolean
  placeholder?: string
  disabled?: boolean
  /** Portal the panel to document.body (default true) — escapes table/toolbar overflow. */
  portal?: boolean
}

export function SimpleSelect({
  value,
  options,
  onChange,
  className,
  fullWidth = false,
  placeholder,
  disabled,
  portal = true,
}: SimpleSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
      portal={portal}
      className={cn(fullWidth ? 'block w-full' : 'inline-block', className)}
    >
      <SelectTrigger className={cn('px-2.5 py-1 text-xs font-semibold shadow-sm', !fullWidth && 'w-auto')}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// Inline-edit drop-in matching the legacy InlineSelect API (auto-opens on mount,
// portals, commits via onSelect, closes via onCancel). For table-cell editing.
export interface InlineMotionSelectProps {
  value: string
  options: SimpleSelectOption[]
  onSelect: (value: string) => void
  onCancel: () => void
  className?: string
}

export function InlineMotionSelect({ value, options, onSelect, onCancel, className }: InlineMotionSelectProps) {
  return (
    <Select
      value={value}
      defaultOpen
      portal
      onValueChange={onSelect}
      onOpenChange={(o) => { if (!o) onCancel() }}
      className={cn('block w-full', className)}
    >
      <SelectTrigger autoFocus className="w-full px-2 py-0.5 text-xs font-semibold">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export interface SelectItemProps {
  value: string
  disabled?: boolean
  className?: string
  children: ReactNode
}

export function SelectItem({ value, disabled = false, className, children }: SelectItemProps) {
  const ctx = useSelectContext('SelectItem')
  const { register, unregister } = ctx
  const selected = ctx.value === value
  const active = ctx.activeValue === value
  const label = typeof children === 'string' ? children : value

  useLayoutEffect(() => {
    register(value, label, disabled)
    return () => unregister(value)
    // Depend on the STABLE callbacks, not the whole ctx object — ctx changes whenever `labels`
    // updates, which would re-run this effect (unregister→register), looping setLabels forever.
  }, [register, unregister, value, label, disabled])

  return (
    <motion.div variants={ctx.reduce ? undefined : ITEM_VARIANTS}>
      <button
        type="button"
        role="option"
        id={ctx.optionId(value)}
        aria-selected={selected}
        // Use aria-disabled (not the `disabled` attr) so the option stays in the a11y
        // tree as a disabled listbox option; clicks are guarded by select() + pointer-events.
        aria-disabled={disabled || undefined}
        tabIndex={-1}
        // Keep focus on the trigger (combobox pattern) — without this, clicking an option moves
        // focus to it, then the panel goes inert and focus is lost to <body>.
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => { if (!disabled) ctx.select(value) }}
        onMouseEnter={() => { if (!disabled) ctx.setActiveValue(value) }}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-left text-xs font-medium outline-none transition-colors',
          active || selected ? 'bg-elevated text-fg' : 'text-text-2',
          disabled && 'pointer-events-none opacity-50',
          className,
        )}
      >
        <span className="truncate">{children}</span>
        {selected ? <Check className="h-3.5 w-3.5 shrink-0 text-text-3" /> : null}
      </button>
    </motion.div>
  )
}
