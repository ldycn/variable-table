import { useCallback, useContext, useLayoutEffect, useRef } from 'react'
import { KeyDirection } from './FieldContext'
import { FieldRegistryContext } from './FieldContext'
import { useFieldCellContext } from './FieldCell'

export interface UseFieldRegistrationOptions {
  type: string
  focus: () => void
  shouldNavigate: (key: KeyDirection) => boolean
  meta?: Record<string, unknown>
}

export function useFieldRegistration(options: UseFieldRegistrationOptions) {
  const cellCtx = useFieldCellContext()
  const registry = useContext(FieldRegistryContext)
  const optionsRef = useRef(options)
  optionsRef.current = options

  useLayoutEffect(() => {
    if (cellCtx && registry) {
      cellCtx.registerInCell({
        type: options.type,
        get focus() { return optionsRef.current.focus },
        get shouldNavigate() { return optionsRef.current.shouldNavigate },
        meta: options.meta,
      })
    }
  }, [cellCtx, registry, options.type, options.meta])

  const navigateTo = useCallback(
    (direction: KeyDirection) => {
      if (registry && cellCtx) {
        return registry.navigate(cellCtx.coord, direction)
      }
      return false
    },
    [registry, cellCtx]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const keyMap: Record<string, KeyDirection | undefined> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        Enter: 'enter',
      }
      const direction = keyMap[e.key]
      if (!direction || !registry || !cellCtx) return false
      if (optionsRef.current.shouldNavigate(direction)) {
        e.preventDefault()
        e.stopPropagation()
        return registry.navigate(cellCtx.coord, direction)
      }
      return false
    },
    [registry, cellCtx]
  )

  return { navigateTo, handleKeyDown, coord: cellCtx?.coord ?? null }
}
