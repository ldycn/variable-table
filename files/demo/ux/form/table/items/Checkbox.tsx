import { useFieldRegistration } from '@/ux/form/field'
import { Checkbox as AntdCheckbox, FormItemProps } from 'antd'
import { CheckboxGroupProps as AntdCheckboxGroupProps } from 'antd/es/checkbox/Group'
import FormItem from 'antd/es/form/FormItem'
import { omit } from 'lodash'
import React, { useCallback, useRef } from 'react'

export interface CheckboxGroupProps extends AntdCheckboxGroupProps {
  _?: any
  formItemProps?: FormItemProps
}

const Checkbox = React.forwardRef<any, CheckboxGroupProps>((props, ref) => {
  const innerRef = useRef<any>(null)
  const mergedRef = ref || innerRef

  const focus = useCallback(() => {
    const el = (mergedRef as any)?.current ?? mergedRef
    el?.focus?.()
  }, [mergedRef])

  const shouldNavigate = useCallback(() => true, [])

  useFieldRegistration({ type: 'checkbox', focus, shouldNavigate })

  let rules = props.formItemProps?.rules || []
  if (props.formItemProps?.required) {
    rules = rules.filter(v => (v as any).required !== true)
    rules.push({ required: true, message: '请选择' + props.formItemProps?.label + '！' })
  }

  return (
    <FormItem {...props.formItemProps} rules={rules} shouldUpdate>
      <AntdCheckbox.Group {...omit(props, ['formItemProps'])} ref={mergedRef} />
    </FormItem>
  )
})

Checkbox.displayName = 'Checkbox'

export default Checkbox
