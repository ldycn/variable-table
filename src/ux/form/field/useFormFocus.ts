import { useCallback, useContext } from 'react'
import { FieldPosition, FieldRegistryContext } from './FieldContext'

export function useFormFocus() {
  const registry = useContext(FieldRegistryContext)

  const focusCell = useCallback(
    (row: number, col: number) => {
      if (!registry) return false
      const controller = registry.getDescriptorAt({ row, col })
      if (controller) {
        controller.focus()
        return true
      }
      return false
    },
    [registry]
  )

  const focusFirstEditableInRow = useCallback(
    (row: number, startCol: number = 0) => {
      if (!registry) return false
      const totalCols = registry.colCount(row)
      for (let col = startCol; col < totalCols; col++) {
        const descriptor = registry.getDescriptorAt({ row, col })
        if (descriptor && descriptor.type === 'inputNumber') {
          descriptor.focus()
          return true
        }
      }
      return false
    },
    [registry]
  )

  const navigate = useCallback(
    (from: FieldPosition, direction: 'up' | 'down' | 'left' | 'right' | 'enter') => {
      if (!registry) return false
      return registry.navigate(from, direction)
    },
    [registry]
  )

  const getFieldDescriptor = useCallback(
    (name: string) => {
      return registry?.getDescriptor(name)
    },
    [registry]
  )

  const watchField = useCallback(
    (name: string, listener: (descriptor: any | undefined) => void) => {
      if (!registry) return () => {}
      return registry.subscribe(name, listener)
    },
    [registry]
  )

  return { focusCell, focusFirstEditableInRow, navigate, getFieldDescriptor, watchField, registry }
}
