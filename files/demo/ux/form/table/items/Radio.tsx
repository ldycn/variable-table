import { useFieldRegistration } from '@/ux/form/field'
import { Radio as AntdRadio, FormItemProps, RadioGroupProps } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import React, { useCallback, useRef } from 'react'

export interface RadioProps extends RadioGroupProps {
  _?: any
  formItemProps?: FormItemProps
}

const Radio = React.forwardRef<any, RadioProps>((props, ref) => {
  const innerRef = useRef<any>(null)
  const mergedRef = ref || innerRef

  const focus = useCallback(() => {
    const el = (mergedRef as any)?.current ?? mergedRef
    el?.focus?.()
  }, [mergedRef])

  const shouldNavigate = useCallback(() => true, [])

  useFieldRegistration({ type: 'radio', focus, shouldNavigate })

  let rules = props.formItemProps?.rules || []
  if (props.formItemProps?.required) {
    rules = rules.filter(v => (v as any).required !== true)
    rules.push({ required: true, message: '请选择' + props.formItemProps?.label + '！' })
  }

  return (
    <FormItem {...props.formItemProps} rules={rules} shouldUpdate>
      <AntdRadio.Group {...props} ref={mergedRef} />
    </FormItem>
  )
})

Radio.displayName = 'Radio'

export default Radio
