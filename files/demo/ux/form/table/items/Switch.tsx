import { useFieldRegistration } from '@/ux/form/field'
import { Switch as AntdSwitch, SwitchProps as AntdSwitchPorps, FormItemProps } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import React, { useCallback, useRef } from 'react'

export interface SwitchProps extends AntdSwitchPorps {
  _?: any
  formItemProps?: FormItemProps
}

const Switch = React.forwardRef<any, SwitchProps>((props, ref) => {
  const innerRef = useRef<any>(null)
  const mergedRef = ref || innerRef

  const focus = useCallback(() => {
    const el = (mergedRef as any)?.current ?? mergedRef
    el?.focus?.()
  }, [mergedRef])

  const shouldNavigate = useCallback(() => true, [])

  const { handleKeyDown } = useFieldRegistration({ type: 'switch', focus, shouldNavigate })

  let rules = props.formItemProps?.rules || []
  if (props.formItemProps?.required) {
    rules = rules.filter(v => (v as any).required !== true)
    rules.push({ required: true, message: '请选择' + props.formItemProps?.label + '！' })
  }

  return (
    <FormItem {...props.formItemProps} rules={rules} shouldUpdate>
      <div onKeyDown={e => handleKeyDown(e)}>
        <AntdSwitch {...props} ref={mergedRef} />
      </div>
    </FormItem>
  )
})

Switch.displayName = 'Switch'

export default Switch
