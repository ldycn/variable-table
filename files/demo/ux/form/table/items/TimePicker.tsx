import { useFieldRegistration } from '@/ux/form/field'
import BaseTimePicker, {
  TimePickerProps as BaseTimePickerProps
} from '@/ux/searcher/items/TimePicker'
import { FormItemProps } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { omit } from 'lodash'
import React, { useCallback, useRef, useState } from 'react'

export interface TimePickerProps extends BaseTimePickerProps {
  _?: any
  formItemProps?: FormItemProps
}

const TimePicker = React.forwardRef<any, TimePickerProps>((props, ref) => {
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

  useFieldRegistration({ type: 'timePicker', focus, shouldNavigate })

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
      <BaseTimePicker
        {...omit(props, ['options', 'placeholder', 'prefix'])}
        searchName={''}
        prefix=''
        bordered={true}
        onOpenChange={(open) => {
          setDropdownOpen(open)
        }}
      />
    </FormItem>
  )
})

TimePicker.displayName = 'TimePicker'

export default TimePicker
