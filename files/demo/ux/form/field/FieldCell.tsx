import React, { useContext, useLayoutEffect, useRef } from 'react'
import { FieldDescriptor, FieldPosition, FieldRegistryContext } from './FieldContext'

interface FieldCellContextValue {
  coord: FieldPosition
  fieldName: string
  registerInCell: (partial: Omit<FieldDescriptor, 'name' | 'position'>) => void
}

const FieldCellContext = React.createContext<FieldCellContextValue | null>(null)

export function useFieldCellContext() {
  return useContext(FieldCellContext)
}

function toNameKey(name: string | string[]): string {
  return Array.isArray(name) ? name.join('.') : name
}

export interface FieldCellProps {
  coord: FieldPosition
  fieldName: string | string[]
  children: React.ReactNode
}

export function FieldCell({ coord, fieldName, children }: FieldCellProps) {
  const registry = useContext(FieldRegistryContext)
  const partialRef = useRef<Omit<FieldDescriptor, 'name' | 'position'> | null>(null)
  const nameStr = toNameKey(fieldName)

  const registerInCell = (partial: Omit<FieldDescriptor, 'name' | 'position'>) => {
    partialRef.current = partial
    if (registry) {
      registry.register({
        name: nameStr,
        position: coord,
        ...partial,
      })
    }
  }

  useLayoutEffect(() => {
    if (registry && partialRef.current) {
      registry.register({
        name: nameStr,
        position: coord,
        ...partialRef.current,
      })
    }
    return () => {
      if (registry) {
        registry.unregister(nameStr)
      }
    }
  }, [registry, coord, nameStr])

  if (!registry) return <>{children}</>

  return (
    <FieldCellContext.Provider value={{ coord, fieldName: nameStr, registerInCell }}>
      {children}
    </FieldCellContext.Provider>
  )
}
