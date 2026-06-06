import { useFieldRegistration } from '@/ux/form/field'
import { Input as AntdInput, InputProps as AntdInputPorps } from 'antd'
import FormItem, { FormItemProps } from 'antd/es/form/FormItem'
import { omit } from 'lodash'
import React, { useCallback, useRef } from 'react'

export interface InputProps extends Omit<AntdInputPorps, 'placeholder'> {
  _?: any
  formItemProps?: FormItemProps
}

const Input = React.forwardRef<any, InputProps>((props, ref) => {
  const innerRef = useRef<any>(null)
  const mergedRef = ref || innerRef

  const focus = useCallback(() => {
    const el = (mergedRef as any)?.current ?? mergedRef
    if (el?.input) el.input.focus()
    else el?.focus?.()
  }, [mergedRef])

  const shouldNavigate = useCallback(
    (key: 'up' | 'down' | 'left' | 'right' | 'enter') => {
      const el = (mergedRef as any)?.current ?? mergedRef
      const input = el?.input
      if (!input) return true
      if (key === 'left') return input.selectionStart === 0
      if (key === 'right') return input.selectionStart === input.value?.length
      return true
    },
    [mergedRef]
  )

  const { handleKeyDown } = useFieldRegistration({ type: 'input', focus, shouldNavigate })

  let rules = props.formItemProps?.rules || []
  if (props.formItemProps?.required) {
    rules = rules.filter(v => (v as any).required !== true)
    rules.push({ required: true, message: '请输入' + props.formItemProps?.label + '！' })
  }
  return (
    <FormItem {...props.formItemProps} rules={rules} label={undefined}>
      <AntdInput
        {...omit(props, 'required', 'formItemProps')}
        ref={mergedRef}
        allowClear
        onKeyDown={e => {
          const navigated = handleKeyDown(e)
          if (!navigated && e.key === 'Enter') {
            e.preventDefault()
          }
        }}
      />
    </FormItem>
  )
})

Input.displayName = 'Input'

export default Input
