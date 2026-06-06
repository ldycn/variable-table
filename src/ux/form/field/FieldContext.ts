import { createContext, useContext } from 'react'

export type KeyDirection = 'up' | 'down' | 'left' | 'right' | 'enter'

export interface FieldPosition {
  row: number
  col: number
}

export interface FieldDescriptor {
  name: string
  position: FieldPosition
  type: string
  focus: () => void
  shouldNavigate: (key: KeyDirection) => boolean
  meta?: Record<string, unknown>
}

export interface FieldRegistryValue {
  regionId: string
  register: (descriptor: FieldDescriptor) => void
  unregister: (name: string) => void
  getDescriptor: (name: string) => FieldDescriptor | undefined
  getDescriptorAt: (position: FieldPosition) => FieldDescriptor | undefined
  navigate: (from: FieldPosition, direction: KeyDirection) => boolean
  subscribe: (name: string, listener: (descriptor: FieldDescriptor | undefined) => void) => () => void
  rowCount: () => number
  colCount: (row: number) => number
}

export const FieldRegistryContext = createContext<FieldRegistryValue | null>(null)

export function useFieldRegistryContext() {
  return useContext(FieldRegistryContext)
}
