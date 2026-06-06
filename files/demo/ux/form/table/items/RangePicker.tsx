import { useFieldRegistration } from '@/ux/form/field'
import { RangePickerProps as BaseRangePickerProps } from '@/ux/searcher/items/RangePicker'
import { DatePicker } from 'antd'
import FormItem, { FormItemProps } from 'antd/es/form/FormItem'
import React, { useCallback, useRef, useState } from 'react'

interface RangePickerProps extends BaseRangePickerProps {
  _?: any
  formItemProps?: FormItemProps
}

const RangePicker = React.forwardRef<any, RangePickerProps>((props, ref) => {
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

  useFieldRegistration({ type: 'rangePicker', focus, shouldNavigate })

  let rules = props.formItemProps?.rules || []
  if (props.formItemProps?.required) {
    rules = rules.filter(v => (v as any).required !== true)
    rules.push({ required: true, message: '请选择' + props.formItemProps?.label + '！' })
  }

  return (
    <FormItem
      {...props.formItemProps}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      rules={rules}
      shouldUpdate
    >
      <DatePicker.RangePicker
        placeholder={['', '']}
        prefix={''}
        {...props}
        onOpenChange={(open) => {
          setDropdownOpen(open)
        }}
      />
    </FormItem>
  )
})

RangePicker.displayName = 'RangePicker'

export default RangePicker
