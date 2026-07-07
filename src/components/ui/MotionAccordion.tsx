'use client'
// OPFOR motion BouncyAccordion — adapted from beui.dev/components/motion/bouncy-accordion to
// the OPFOR design system (framer-motion + design tokens). Single-open accordion with a
// weighted spring layout: connected rows move together, content height springs open with a
// gentle bounce, chevron rotates on a spring. Reduced-motion safe. Div-based (use for
// genuinely list-shaped content — not table rows, where height animation is unreliable).

import { motion, useReducedMotion, type Transition } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { EASE_OUT } from '@/lib/ease'
import { cn } from '@/lib/utils'

export type BouncyAccordionItem = {
  id: string
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  disabled?: boolean
}

export type BouncyAccordionClassNames = {
  root?: string
  item?: string
  trigger?: string
  icon?: string
  title?: string
  chevron?: string
  content?: string
  description?: string
}

export interface BouncyAccordionProps {
  items: BouncyAccordionItem[]
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  collapsible?: boolean
  className?: string
  classNames?: BouncyAccordionClassNames
}

// Group radius for the first/last items of a connected run.
const GROUP_RADIUS = 16

const ROW_TRANSITION: Transition = { type: 'spring', duration: 0.55, bounce: 0.38 }
const CONTENT_OPEN_TRANSITION: Transition = { type: 'spring', duration: 0.58, bounce: 0.32 }
const CONTENT_CLOSE_TRANSITION: Transition = { type: 'spring', duration: 0.46, bounce: 0.26 }
const DESCRIPTION_TRANSITION: Transition = { duration: 0.18, ease: EASE_OUT }
const CHEVRON_TRANSITION: Transition = { type: 'spring', duration: 0.42, bounce: 0.28 }

function useControllableAccordionValue({
  value,
  defaultValue,
  onValueChange,
}: {
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
}) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? null)
  const isControlled = value !== undefined
  // Use an explicit controlled check, not `value ?? internalValue` — a controlled
  // `value={null}` ("all collapsed") must win over internal state, but `?? ` would
  // treat null like undefined and fall through to internalValue.
  const currentValue = isControlled ? value : internalValue

  const setValue = useCallback(
    (next: string | null) => {
      if (!isControlled) setInternalValue(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange],
  )

  return [currentValue, setValue] as const
}

function BouncyAccordionRow({
  item,
  open,
  startsGroup,
  endsGroup,
  separatedFromPrevious,
  contentId,
  triggerId,
  reduce,
  classNames,
  onToggle,
}: {
  item: BouncyAccordionItem
  open: boolean
  startsGroup: boolean
  endsGroup: boolean
  separatedFromPrevious: boolean
  contentId: string
  triggerId: string
  reduce: boolean | null
  classNames?: BouncyAccordionClassNames
  onToggle: () => void
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)

  useLayoutEffect(() => {
    const node = contentRef.current
    if (!node) return
    const updateHeight = () => setContentHeight(node.offsetHeight)
    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      initial={false}
      animate={{ marginTop: separatedFromPrevious ? 12 : 0 }}
      transition={reduce ? { duration: 0 } : ROW_TRANSITION}
    >
      <motion.div
        data-state={open ? 'open' : 'closed'}
        initial={false}
        animate={{
          borderTopLeftRadius: startsGroup ? GROUP_RADIUS : 0,
          borderTopRightRadius: startsGroup ? GROUP_RADIUS : 0,
          borderBottomLeftRadius: endsGroup ? GROUP_RADIUS : 0,
          borderBottomRightRadius: endsGroup ? GROUP_RADIUS : 0,
        }}
        transition={reduce ? { duration: 0 } : ROW_TRANSITION}
        className={cn(
          'overflow-hidden border border-border bg-surface text-fg',
          item.disabled && 'opacity-50',
          classNames?.item,
        )}
      >
        <button
          id={triggerId}
          type="button"
          disabled={item.disabled}
          aria-expanded={open}
          aria-controls={contentId}
          onClick={onToggle}
          className={cn(
            'flex min-h-[54px] w-full items-center gap-4 px-5 text-left outline-none transition-colors',
            'focus-visible:bg-surface-2/40',
            'disabled:pointer-events-none',
            classNames?.trigger,
          )}
        >
          {item.icon ? (
            <span className={cn('grid h-7 w-7 shrink-0 place-items-center text-text-3', classNames?.icon)}>
              {item.icon}
            </span>
          ) : null}
          <span className={cn('min-w-0 flex-1 truncate text-[15px] font-medium text-fg', classNames?.title)}>
            {item.title}
          </span>
          <motion.span
            aria-hidden
            animate={{ rotate: open ? 180 : 0 }}
            transition={reduce ? { duration: 0 } : CHEVRON_TRANSITION}
            className={cn('grid h-6 w-6 shrink-0 place-items-center text-text-3', classNames?.chevron)}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </button>

        <motion.div
          id={contentId}
          role="region"
          aria-labelledby={triggerId}
          aria-hidden={!open}
          initial={false}
          animate={{ height: open && item.description ? contentHeight : 0 }}
          transition={
            reduce ? { duration: 0 } : open ? CONTENT_OPEN_TRANSITION : CONTENT_CLOSE_TRANSITION
          }
          className={cn('overflow-hidden', classNames?.content)}
        >
          <motion.div
            ref={contentRef}
            animate={{ opacity: open ? 1 : 0 }}
            transition={reduce ? { duration: 0 } : DESCRIPTION_TRANSITION}
            className="px-5 pb-5"
          >
            <div className={cn('text-[15px] leading-6 text-text-2', classNames?.description)}>
              {item.description}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export function BouncyAccordion({
  items,
  value,
  defaultValue = null,
  onValueChange,
  collapsible = true,
  className,
  classNames,
}: BouncyAccordionProps) {
  const reduce = useReducedMotion()
  const baseId = useId()
  const [activeValue, setActiveValue] = useControllableAccordionValue({ value, defaultValue, onValueChange })
  const activeIndex = items.findIndex((item) => item.id === activeValue)

  const toggleItem = useCallback(
    (id: string) => {
      if (activeValue === id) {
        if (collapsible) setActiveValue(null)
        return
      }
      setActiveValue(id)
    },
    [activeValue, collapsible, setActiveValue],
  )

  return (
    <div className={cn('w-full', className, classNames?.root)}>
      {items.map((item, index) => {
        const open = activeValue === item.id
        const previousIsOpen = activeIndex === index - 1
        const nextIsOpen = activeIndex === index + 1
        const startsGroup = open || index === 0 || previousIsOpen
        const endsGroup = open || index === items.length - 1 || nextIsOpen
        const separatedFromPrevious = index > 0 && (open || previousIsOpen)
        const contentId = `${baseId}-${item.id}-content`
        const triggerId = `${baseId}-${item.id}-trigger`

        return (
          <BouncyAccordionRow
            key={item.id}
            item={item}
            open={open}
            startsGroup={startsGroup}
            endsGroup={endsGroup}
            separatedFromPrevious={separatedFromPrevious}
            contentId={contentId}
            triggerId={triggerId}
            reduce={reduce}
            classNames={classNames}
            onToggle={() => toggleItem(item.id)}
          />
        )
      })}
    </div>
  )
}
