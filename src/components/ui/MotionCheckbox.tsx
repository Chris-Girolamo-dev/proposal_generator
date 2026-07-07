'use client'
// OPFOR motion Checkbox — adapted from beui.dev/components/motion/checkbox to the OPFOR
// design system (framer-motion + tokens). Draw-on check mark + spring press. Greyscale
// checked state (white fill / dark mark) to match the minimal Switch, not a color accent.

import { AnimatePresence, motion, useReducedMotion, type Transition } from 'framer-motion'
import { useId } from 'react'
import { cn } from '@/lib/utils'

const EASE_OUT = [0.16, 1, 0.3, 1] as const
const SPRING_PRESS: Transition = { type: 'spring', stiffness: 500, damping: 30 }
const CHECK_PATH = 'M5 13l4 4L19 7'
const INDETERMINATE_PATH = 'M6 12h12'

export interface CheckboxProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  indeterminate?: boolean
  label?: string
  className?: string
  /** Extra classes for the label text (e.g. compact text-[11px] in dense lists). */
  labelClassName?: string
  /** 'md' = 18px (default); 'sm' = 15px (~15% smaller) for dense lists. */
  size?: 'sm' | 'md'
  id?: string
}

export function Checkbox({
  checked,
  onCheckedChange,
  disabled,
  indeterminate,
  label,
  className,
  labelClassName,
  size = 'md',
  id: idProp,
}: CheckboxProps) {
  const autoId = useId()
  const id = idProp ?? autoId
  const reduce = useReducedMotion()
  const showMark = checked || indeterminate
  const path = indeterminate ? INDETERMINATE_PATH : CHECK_PATH
  const boxSize = size === 'sm' ? 'h-[15px] w-[15px]' : 'h-[18px] w-[18px]'
  const markPx = size === 'sm' ? 9 : 11

  return (
    // No htmlFor — the <label> wraps the control directly, so association is implicit (an explicit
    // htmlFor would make some screen readers announce the name twice).
    <label
      className={cn(
        'inline-flex items-center gap-2',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      )}
    >
      <motion.button
        id={id}
        type="button"
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : checked}
        disabled={disabled}
        onClick={() => !disabled && onCheckedChange(!checked)}
        whileTap={reduce || disabled ? undefined : { scale: 0.92 }}
        transition={SPRING_PRESS}
        data-state={checked ? 'checked' : indeterminate ? 'indeterminate' : 'unchecked'}
        className={cn(
          'inline-flex shrink-0 items-center justify-center rounded-md border-2 outline-none transition-colors duration-200',
          boxSize,
          'focus-visible:ring-2 focus-visible:ring-red/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
          'disabled:cursor-not-allowed disabled:opacity-60',
          // Off-white fill (fg/85) rather than pure white — softer in dense lists.
          showMark ? 'border-fg/85 bg-fg/85 text-canvas' : 'border-border-2 bg-canvas hover:border-text-3',
        )}
      >
        <AnimatePresence initial={false}>
          {showMark ? (
            <motion.svg
              key={indeterminate ? 'indeterminate' : 'checked'}
              width={markPx}
              height={markPx}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.5 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5, filter: 'blur(4px)' }}
              transition={reduce ? { duration: 0 } : { duration: 0.16, ease: EASE_OUT }}
              aria-hidden
            >
              <title>{indeterminate ? 'Partially selected' : 'Selected'}</title>
              <motion.path
                d={path}
                initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: indeterminate ? 0.2 : 0.3, ease: EASE_OUT, delay: 0.04 }
                }
              />
            </motion.svg>
          ) : null}
        </AnimatePresence>
      </motion.button>
      {label ? (
        <span className={cn('select-none text-sm text-fg', labelClassName, disabled && 'opacity-60')}>{label}</span>
      ) : null}
    </label>
  )
}
