'use client'
// OPFOR motion Tooltip — adapted from beui.dev/components/motion/tooltip to the OPFOR
// design system (framer-motion + design tokens). Content fades and un-blurs in from a
// spring origin near the trigger. Hover-capable gated (no phantom tooltips on touch),
// reduced-motion aware, and "warms up" so moving along a toolbar feels instant.

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from 'framer-motion'
import {
  cloneElement,
  isValidElement,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { EASE_OUT } from '@/lib/ease'
import { useHoverCapable } from '@/lib/hooks/use-hover-capable'
import { cn } from '@/lib/utils'

type Side = 'top' | 'right' | 'bottom' | 'left'

export interface TooltipProps {
  content: ReactNode
  children: ReactElement
  side?: Side
  /** Delay before showing (ms). Default 120. */
  delay?: number
  className?: string
  /** Classes for the outer wrapper span. Use to fix baseline / fill parent. */
  wrapperClassName?: string
}

// Fixed-position anchor for the portaled tooltip, computed from the trigger rect.
// Portaling (to document.body) is what stops the tooltip clipping inside scrolling
// tables/toolbars; the padding leaves the gap between trigger and bubble.
function anchorStyle(side: Side, r: DOMRect): CSSProperties {
  switch (side) {
    case 'top': return { left: r.left + r.width / 2, top: r.top, transform: 'translate(-50%, -100%)', paddingBottom: 8 }
    case 'bottom': return { left: r.left + r.width / 2, top: r.bottom, transform: 'translate(-50%, 0)', paddingTop: 8 }
    case 'left': return { left: r.left, top: r.top + r.height / 2, transform: 'translate(-100%, -50%)', paddingRight: 8 }
    case 'right': return { left: r.right, top: r.top + r.height / 2, transform: 'translate(0, -50%)', paddingLeft: 8 }
  }
}

const transformOrigin: Record<Side, string> = {
  top: 'center bottom',
  bottom: 'center top',
  left: 'right center',
  right: 'left center',
}

// Offset is in the direction *away* from the trigger — content originates near
// the trigger and rises into resting position.
const offsetFrom: Record<Side, { x?: number; y?: number }> = {
  top: { y: 10 },
  bottom: { y: -10 },
  left: { x: 10 },
  right: { x: -10 },
}

function buildVariants(side: Side): Variants {
  const o = offsetFrom[side]
  return {
    initial: {
      opacity: 0,
      scale: 0.85,
      filter: 'blur(10px)',
      x: o.x ?? 0,
      y: o.y ?? 0,
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      x: 0,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 380,
        damping: 30,
        mass: 0.7,
        opacity: { duration: 0.22, ease: EASE_OUT },
        filter: { duration: 0.3, ease: EASE_OUT },
      },
    },
    exit: {
      opacity: 0,
      scale: 0.92,
      filter: 'blur(6px)',
      x: (o.x ?? 0) * 0.6,
      y: (o.y ?? 0) * 0.6,
      transition: { duration: 0.14, ease: EASE_OUT },
    },
  }
}

const REDUCED_VARIANTS: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.14, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: 0.1, ease: EASE_OUT } },
}

// Once any tooltip has just closed, neighbouring tooltips open without the
// initial delay — moving along a toolbar feels instant after the first one.
const WARM_WINDOW_MS = 300
let lastHiddenAt = 0

export function Tooltip({
  content,
  children,
  side = 'top',
  delay = 120,
  className,
  wrapperClassName,
}: TooltipProps) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<DOMRect | null>(null)
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const id = useId()
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reduce = useReducedMotion()
  const canHover = useHoverCapable()

  const captureCoords = () => {
    if (wrapperRef.current) setCoords(wrapperRef.current.getBoundingClientRect())
  }

  const show = () => {
    if (!canHover) return
    if (timer.current) clearTimeout(timer.current)
    // Date.now is fine in an event handler (client-only, not render).
    const warm = Date.now() - lastHiddenAt < WARM_WINDOW_MS
    timer.current = setTimeout(() => { captureCoords(); setOpen(true) }, warm ? 0 : delay)
  }
  const hide = () => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
    if (open) lastHiddenAt = Date.now()
    setOpen(false)
  }
  // Touch fallback: hover never fires on touch devices, so several config tooltips
  // (Mode, Dropout, Dose Escalation) would be unreachable. On a no-hover device a
  // tap toggles the tooltip open and it auto-dismisses shortly after.
  const onTap = () => {
    if (canHover) return
    if (timer.current) clearTimeout(timer.current)
    if (open) {
      setOpen(false)
      return
    }
    captureCoords()
    setOpen(true)
    timer.current = setTimeout(() => setOpen(false), 2600)
  }

  if (!isValidElement(children)) return children

  // Preserve any handlers already on the child by chaining ours after them.
  const childProps = (children as ReactElement<Record<string, unknown>>).props
  const chain = <E,>(theirs: unknown, ours: (e: E) => void) => (e: E) => {
    if (typeof theirs === 'function') (theirs as (e: E) => void)(e)
    ours(e)
  }
  const trigger = cloneElement(children as ReactElement<Record<string, unknown>>, {
    onMouseEnter: chain(childProps.onMouseEnter, show),
    onMouseLeave: chain(childProps.onMouseLeave, hide),
    onFocus: chain(childProps.onFocus, show),
    onBlur: chain(childProps.onBlur, hide),
    onClick: chain(childProps.onClick, onTap),
    'aria-describedby': id,
  })

  const variants = reduce ? REDUCED_VARIANTS : buildVariants(side)

  return (
    <span ref={wrapperRef} className={cn('relative inline-flex align-middle', wrapperClassName)}>
      {trigger}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence mode="wait">
          {open && coords ? (
            <span
              className="pointer-events-none fixed z-[9999]"
              style={anchorStyle(side, coords)}
            >
              <motion.span
                id={id}
                role="tooltip"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{
                  transformOrigin: transformOrigin[side],
                  willChange: 'transform, opacity, filter',
                }}
                className={cn(
                  'block whitespace-nowrap rounded-lg border border-border bg-elevated/90 px-2.5 py-1 text-[11px] font-medium text-white shadow-2xl backdrop-blur-xl',
                  className,
                )}
              >
                {content}
              </motion.span>
            </span>
          ) : null}
        </AnimatePresence>,
        document.body,
      )}
    </span>
  )
}
