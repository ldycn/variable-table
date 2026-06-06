import { useCallback, useMemo, useRef } from 'react'
import { FieldDescriptor, FieldPosition, FieldRegistryValue, KeyDirection } from './FieldContext'

function posKey(pos: FieldPosition): string {
  return `${pos.row}:${pos.col}`
}

function nameKey(name: string | string[]): string {
  return Array.isArray(name) ? name.join('.') : name
}

export function useFieldRegistryProvider(regionId: string): FieldRegistryValue {
  const byPosition = useRef<Map<string, FieldDescriptor>>(new Map())
  const byName = useRef<Map<string, FieldDescriptor>>(new Map())
  const listeners = useRef<Map<string, Set<(desc: FieldDescriptor | undefined) => void>>>(new Map())
  const maxColRef = useRef<Map<number, number>>(new Map())

  const notify = useCallback((name: string, descriptor: FieldDescriptor | undefined) => {
    const key = nameKey(name)
    listeners.current.get(key)?.forEach(fn => fn(descriptor))
  }, [])

  const register = useCallback(
    (descriptor: FieldDescriptor) => {
      const pk = posKey(descriptor.position)
      const nk = nameKey(descriptor.name)
      byPosition.current.set(pk, descriptor)
      byName.current.set(nk, descriptor)
      const currentMax = maxColRef.current.get(descriptor.position.row) ?? -1
      if (descriptor.position.col > currentMax) {
        maxColRef.current.set(descriptor.position.row, descriptor.position.col)
      }
      notify(descriptor.name, descriptor)
    },
    [notify]
  )

  const unregister = useCallback(
    (name: string | string[]) => {
      const nk = nameKey(name)
      const descriptor = byName.current.get(nk)
      if (descriptor) {
        byPosition.current.delete(posKey(descriptor.position))
        byName.current.delete(nk)
      }
      notify(nk, undefined)
    },
    [notify]
  )

  const getDescriptor = useCallback((name: string | string[]) => {
    return byName.current.get(nameKey(name))
  }, [])

  const getDescriptorAt = useCallback((pos: FieldPosition) => {
    return byPosition.current.get(posKey(pos))
  }, [])

  const rowCount = useCallback(() => {
    let max = 0
    byPosition.current.forEach((_, key) => {
      const row = parseInt(key.split(':')[0], 10)
      if (row > max) max = row
    })
    return max + 1
  }, [])

  const colCount = useCallback((row: number) => {
    return (maxColRef.current.get(row) ?? 0) + 1
  }, [])

  const navigate = useCallback(
    (from: FieldPosition, direction: KeyDirection): boolean => {
      const totalRows = rowCount()
      const fromCols = colCount(from.row)
      let targetRow = from.row
      let targetCol = from.col

      switch (direction) {
        case 'up':
          targetRow = from.row > 0 ? from.row - 1 : totalRows - 1
          targetCol = Math.min(from.col, colCount(targetRow) - 1)
          break
        case 'down':
          targetRow = from.row < totalRows - 1 ? from.row + 1 : 0
          targetCol = Math.min(from.col, colCount(targetRow) - 1)
          break
        case 'left':
          if (from.col > 0) {
            targetCol = from.col - 1
          } else {
            targetRow = from.row > 0 ? from.row - 1 : totalRows - 1
            targetCol = colCount(targetRow) - 1
          }
          break
        case 'right':
        case 'enter':
          if (from.col < fromCols - 1) {
            targetCol = from.col + 1
          } else {
            targetRow = from.row < totalRows - 1 ? from.row + 1 : 0
            targetCol = 0
          }
          break
      }

      const target = getDescriptorAt({ row: targetRow, col: targetCol })
      if (target) {
        target.focus()
        return true
      }
      return false
    },
    [rowCount, colCount, getDescriptorAt]
  )

  const subscribe = useCallback(
    (name: string | string[], listener: (descriptor: FieldDescriptor | undefined) => void) => {
      const key = nameKey(name)
      if (!listeners.current.has(key)) {
        listeners.current.set(key, new Set())
      }
      listeners.current.get(key)!.add(listener)
      return () => {
        listeners.current.get(key)?.delete(listener)
      }
    },
    []
  )

  return useMemo(
    () => ({
      regionId,
      register,
      unregister,
      getDescriptor,
      getDescriptorAt,
      navigate,
      subscribe,
      rowCount,
      colCount
    }),
    [
      regionId,
      register,
      unregister,
      getDescriptor,
      getDescriptorAt,
      navigate,
      subscribe,
      rowCount,
      colCount
    ]
  )
}
