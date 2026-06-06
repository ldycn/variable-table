import { useFieldRegistration } from '@/ux/form/field'
import { Select as AntdSelect, SelectProps as AntdSelectProps } from 'antd'
import FormItem, { FormItemProps } from 'antd/es/form/FormItem'
import { omit } from 'lodash'
import React, { useCallback, useRef, useState } from 'react'

export interface SelectProps extends Omit<AntdSelectProps, 'placeholder'> {
  _?: any
  formItemProps?: FormItemProps
}

const Select = React.forwardRef<any, SelectProps>((props, ref) => {
  const innerRef = useRef<any>(null)
  const mergedRef = ref || innerRef
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const focus = useCallback(() => {
    const el = (mergedRef as any)?.current ?? mergedRef
    el?.focus?.()
  }, [mergedRef])

  const shouldNavigate = useCallback(
    () => !dropdownOpen,
    [dropdownOpen]
  )

  const { handleKeyDown } = useFieldRegistration({ type: 'select', focus, shouldNavigate })

  let rules = props.formItemProps?.rules || []
  if (props.formItemProps?.required) {
    rules = rules.filter(v => (v as any).required !== true)
    rules.push({ required: true, message: '请选择' + props.formItemProps?.label + '！' })
  }

  return (
    <FormItem {...props.formItemProps} rules={rules} label={undefined}>
      <AntdSelect
        {...omit(props, ['formItemProps'])}
        ref={mergedRef}
        open={dropdownOpen}
        dropdownMatchSelectWidth={false}
        onDropdownVisibleChange={(open) => {
          if (!open) setDropdownOpen(false)
          props.onDropdownVisibleChange?.(open)
        }}
        onDoubleClick={() => {
          setDropdownOpen(true)
        }}
        onKeyDown={e => {
          handleKeyDown(e)
        }}
      />
    </FormItem>
  )
})

Select.displayName = 'Select'

export default Select
