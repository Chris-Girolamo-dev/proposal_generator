'use client'
// OPFOR motion action-swap — adapted from beui.dev/components/motion/action-swap to the
// OPFOR design system (framer-motion + design tokens). Presentational swap primitives:
// ActionSwapText animates its width and rolls/blurs the label between values;
// ActionSwapIcon pops the icon between values. Keyed on `value` — render them inside an
// existing button and change `value` to trigger the swap (no click-cycle behavior here).

import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion'
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { EASE_OUT, EASE_OUT_CSS } from '@/lib/ease'
import { cn } from '@/lib/utils'

export type ActionSwapAnimation = 'blur' | 'roll'

const BLUR_TRANSITION = { duration: 0.2, ease: 'easeInOut' } as const
const ROLL_TRANSITION = { duration: 0.24, ease: EASE_OUT } as const
const SWAP_BLUR = 'blur(8px)'
const ROLL_BLUR = 'blur(6px)'

const TEXT_VARIANTS: Record<ActionSwapAnimation, Variants> = {
  blur: {
    initial: { opacity: 0, scale: 0.94, filter: SWAP_BLUR },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: BLUR_TRANSITION },
    exit: { opacity: 0, scale: 0.94, filter: SWAP_BLUR, transition: BLUR_TRANSITION },
  },
  roll: {
    initial: { opacity: 0, y: '115%', filter: ROLL_BLUR },
    animate: { opacity: 1, y: '0%', filter: 'blur(0px)', transition: ROLL_TRANSITION },
    exit: { opacity: 0, y: '-115%', filter: ROLL_BLUR, transition: { duration: 0.18, ease: 'easeInOut' } },
  },
}

const ICON_VARIANTS: Record<ActionSwapAnimation, Variants> = {
  blur: {
    initial: { opacity: 0, scale: 0.25, filter: SWAP_BLUR },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: BLUR_TRANSITION },
    exit: { opacity: 0, scale: 0.25, filter: SWAP_BLUR, transition: BLUR_TRANSITION },
  },
  roll: {
    initial: { opacity: 0, y: 16, filter: ROLL_BLUR },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: ROLL_TRANSITION },
    exit: { opacity: 0, y: -16, filter: ROLL_BLUR, transition: { duration: 0.18, ease: 'easeInOut' } },
  },
}

export interface ActionSwapTextProps {
  value: string
  children: ReactNode
  animation?: ActionSwapAnimation
  className?: string
}

export function ActionSwapText({ value, children, animation = 'blur', className }: ActionSwapTextProps) {
  const reduce = useReducedMotion()
  const measureRef = useRef<HTMLSpanElement>(null)
  const [width, setWidth] = useState<number>()

  // Re-measure the (hidden) label whenever the swap value changes so the pill
  // width animates between labels of different lengths. The functional setState
  // bails out when the width is unchanged, so this can't loop.
  useLayoutEffect(() => {
    const nextWidth = measureRef.current?.offsetWidth
    if (!nextWidth) return
    setWidth((current) => (current === nextWidth ? current : nextWidth))
  }, [value])

  return (
    <span
      className={cn('relative inline-block overflow-hidden whitespace-nowrap align-bottom', className)}
      style={{ width, transition: reduce ? undefined : `width 220ms ${EASE_OUT_CSS}` }}
    >
      <span ref={measureRef} aria-hidden className="invisible inline-block whitespace-nowrap">
        {children}
      </span>
      <AnimatePresence initial={false}>
        <motion.span
          key={`${animation}-${value}`}
          variants={TEXT_VARIANTS[animation]}
          initial={reduce ? false : 'initial'}
          animate={reduce ? { opacity: 1, filter: 'blur(0px)', scale: 1, y: 0 } : 'animate'}
          exit={reduce ? undefined : 'exit'}
          className="absolute left-0 top-0 inline-block will-change-[opacity,filter,transform]"
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export interface ActionSwapIconProps {
  value: string
  children: ReactNode
  animation?: ActionSwapAnimation
  className?: string
}

export function ActionSwapIcon({ value, children, animation = 'blur', className }: ActionSwapIconProps) {
  const reduce = useReducedMotion()

  return (
    <span className={cn('relative inline-grid shrink-0 place-items-center overflow-hidden', className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={`${animation}-${value}`}
          aria-hidden
          variants={ICON_VARIANTS[animation]}
          initial={reduce ? false : 'initial'}
          animate={reduce ? { opacity: 1, filter: 'blur(0px)', scale: 1, y: 0 } : 'animate'}
          exit={reduce ? undefined : 'exit'}
          className="col-start-1 row-start-1 inline-flex items-center justify-center will-change-[opacity,filter,transform]"
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
