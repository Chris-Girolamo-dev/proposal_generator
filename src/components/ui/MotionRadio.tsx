'use client'
// OPFOR motion RadioGroup — adapted from beui.dev/components/motion/radio to the OPFOR
// design system. Greyscale selected dot (off-white, not green/red) that glides between
// options via a shared layoutId. The whileTap scale is on the small circle only (it can't
// shift/cover sibling options), and each item is its own button — so picking either option
// always registers. Reduced-motion safe.

import { motion, MotionConfig, useReducedMotion } from 'framer-motion'
import { createContext, useContext, useId, useState, type ReactNode } from 'react'
import { SPRING_LAYOUT, SPRING_PRESS } from '@/lib/ease'
import { cn } from '@/lib/utils'

type RadioCtx = {
  value: string
  setValue: (value: string) => void
  layoutId: string
}

const RadioCtx = createContext<RadioCtx | null>(null)

function useRadioGroup() {
  const ctx = useContext(RadioCtx)
  if (!ctx) throw new Error('RadioGroupItem must be used inside <RadioGroup>')
  return ctx
}

export interface RadioGroupProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: ReactNode
  className?: string
  orientation?: 'vertical' | 'horizontal'
}

export function RadioGroup({
  value,
  defaultValue = '',
  onValueChange,
  children,
  className,
  orientation = 'vertical',
}: RadioGroupProps) {
  const [internal, setInternal] = useState(defaultValue)
  const layoutId = useId()
  const reduce = useReducedMotion()
  const controlled = value !== undefined
  const current = controlled ? value : internal
  const setValue = (next: string) => {
    if (!controlled) setInternal(next)
    onValueChange?.(next)
  }

  return (
    <MotionConfig transition={reduce ? { duration: 0 } : SPRING_LAYOUT}>
      <RadioCtx.Provider value={{ value: current, setValue, layoutId }}>
        <div
          role="radiogroup"
          className={cn('flex gap-2', orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap', className)}
        >
          {children}
        </div>
      </RadioCtx.Provider>
    </MotionConfig>
  )
}

export interface RadioGroupItemProps {
  value: string
  label?: ReactNode
  disabled?: boolean
  className?: string
  /** Extra classes for the label text (e.g. compact text-[11px] in dense forms). */
  labelClassName?: string
  id?: string
}

export function RadioGroupItem({
  value,
  label,
  disabled,
  className,
  labelClassName,
  id: idProp,
}: RadioGroupItemProps) {
  const { value: groupValue, setValue, layoutId } = useRadioGroup()
  const autoId = useId()
  const id = idProp ?? autoId
  const reduce = useReducedMotion()
  const selected = groupValue === value

  return (
    <label
      htmlFor={id}
      className={cn('inline-flex items-center gap-2', disabled ? 'cursor-not-allowed' : 'cursor-pointer', className)}
    >
      <motion.button
        id={id}
        type="button"
        role="radio"
        aria-checked={selected}
        disabled={disabled}
        onClick={() => !disabled && setValue(value)}
        whileTap={reduce || disabled ? undefined : { scale: 0.9 }}
        transition={SPRING_PRESS}
        data-state={selected ? 'checked' : 'unchecked'}
        className={cn(
          'relative inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 outline-none transition-colors duration-200',
          'focus-visible:ring-2 focus-visible:ring-red/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
          'disabled:cursor-not-allowed disabled:opacity-60',
          selected ? 'border-fg/85' : 'border-border-2 hover:border-text-3',
        )}
      >
        {selected ? (
          <motion.span
            layoutId={layoutId}
            className="absolute inset-[3px] rounded-full bg-fg/85"
            transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
          />
        ) : null}
      </motion.button>
      {label ? (
        <span className={cn('select-none text-sm text-text-2', labelClassName, disabled && 'opacity-60')}>
          {label}
        </span>
      ) : null}
    </label>
  )
}
