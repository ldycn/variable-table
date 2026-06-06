import { useFieldRegistration } from '@/ux/form/field'
import BaseDatePicker, {
  DatePickerProps as BaseDatePickerProps
} from '@/ux/searcher/items/DatePicker'
import FormItem, { FormItemProps } from 'antd/es/form/FormItem'
import { omit } from 'lodash'
import React, { useCallback, useRef, useState } from 'react'

export interface DatePickerProps extends Omit<BaseDatePickerProps, 'searchName'> {
  _?: any
  formItemProps?: FormItemProps
}

const DatePicker = React.forwardRef<any, DatePickerProps>((props, ref) => {
  const innerRef = useRef<any>(null)
  const mergedRef = ref || innerRef
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const focus = useCallback(() => {
    const el = (mergedRef as any)?.current ?? mergedRef
    if (el?.input) el.input.focus()
    else el?.focus?.()
  }, [mergedRef])

  const shouldNavigate = useCallback(
    () => !dropdownOpen,
    [dropdownOpen]
  )

  useFieldRegistration({ type: 'datePicker', focus, shouldNavigate })

  const labelName = props.formItemProps?.labelName || props.formItemProps?.label
  let rules = props.formItemProps?.rules || []
  if (props.formItemProps?.required) {
    rules = rules.filter(v => (v as any).required !== true)
    rules.push({ required: true, message: '请选择' + labelName + '！' })
  }

  return (
    <FormItem
      {...props.formItemProps}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      rules={rules}
      shouldUpdate
    >
      <BaseDatePicker
        {...omit(props, ['options', 'placeholder', 'prefix'])}
        searchName={''}
        prefix={''}
        bordered
        allowClear
        onOpenChange={(open) => {
          setDropdownOpen(open)
        }}
      />
    </FormItem>
  )
})

DatePicker.displayName = 'DatePicker'

export default DatePicker
