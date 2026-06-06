import { useFieldRegistration } from '@/ux/form/field'
import { InputNumber as AntdInputNumber, InputNumberProps as AntdInputNumberPorps } from 'antd'
import FormItem, { FormItemProps } from 'antd/es/form/FormItem'
import { omit } from 'lodash'
import React, { useCallback, useRef } from 'react'

export interface InputProps extends Omit<AntdInputNumberPorps, 'placeholder'> {
  _?: any
  formItemProps?: FormItemProps
}

const InputNumber = React.forwardRef<any, InputProps>((props, ref) => {
  const innerRef = useRef<any>(null)

  const focus = useCallback(() => {
    const el = innerRef.current
    if (el?.input) el.input.focus()
    else el?.focus?.()
  }, [])

  const shouldNavigate = useCallback(() => true, [])

  const { handleKeyDown } = useFieldRegistration({ type: 'inputNumber', focus, shouldNavigate })

  let rules = props.formItemProps?.rules || []
  if (props.formItemProps?.required) {
    rules = rules.filter(v => (v as any).required !== true)
    rules.push({ required: true, message: '请输入' + props.formItemProps?.label + '！' })
  }
  return (
    <FormItem {...props.formItemProps} rules={rules} shouldUpdate label={undefined}>
      <AntdInputNumber
        {...omit(props, 'required', 'formItemProps')}
        ref={(node) => {
          innerRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
        }}
        controls={false}
        onKeyDown={e => {
          e.stopPropagation()
          const navigated = handleKeyDown(e)
          if (!navigated) {
            if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
              e.preventDefault()
            }
          }
        }}
      />
    </FormItem>
  )
})

InputNumber.displayName = 'InputNumber'

export default InputNumber
