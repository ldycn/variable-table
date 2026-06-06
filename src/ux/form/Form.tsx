import { FieldRegistryContext } from '@/ux/form/field/FieldContext'
import { useFieldRegistryProvider } from '@/ux/form/field/useFieldRegistry'
import { useFormFocus } from '@/ux/form/field/useFormFocus'
import { Form as AntdForm } from 'antd'
import React, { useEffect, useRef } from 'react'

const FocusForm = React.forwardRef<any, React.ComponentProps<typeof AntdForm>>(
  (props, ref) => {
    const regionIdRef = useRef(`form-${Math.random().toString(36).slice(2)}`)
    const registry = useFieldRegistryProvider(regionIdRef.current)

    useEffect(() => {
      if (props.form) {
        ;(props.form as any).__fieldRegistry = registry
      }
    }, [props.form, registry])

    return (
      <FieldRegistryContext.Provider value={registry}>
        <AntdForm ref={ref} {...props} />
      </FieldRegistryContext.Provider>
    )
  }
)

FocusForm.displayName = 'FocusForm'

export { useFormFocus }
export type { AntdForm as FormType }

export default FocusForm
