import { useFieldRegistration } from '@/ux/form/field'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { InputNumber as AntdInputNumber, InputNumberProps as AntdInputNumberProps, Button } from 'antd'
import FormItem, { FormItemProps } from 'antd/es/form/FormItem'
import { omit } from 'lodash'
import React, { useCallback, useRef } from 'react'

export interface InputNumberWithStepperProps
  extends Omit<AntdInputNumberProps, 'placeholder'> {
  /** 占位 */
  _?: any
  /** FormItem Props */
  formItemProps?: FormItemProps
}

const InputNumberWithStepper = React.forwardRef<any, InputNumberWithStepperProps>((props, ref) => {
  const { formItemProps, min, max, step = 1, value, onChange, disabled } = props
  const innerRef = useRef<any>(null)
  const mergedRef = ref || innerRef

  const focus = useCallback(() => {
    const el = (mergedRef as any)?.current ?? mergedRef
    if (el?.input) el.input.focus()
    else el?.focus?.()
  }, [mergedRef])

  const shouldNavigate = useCallback(() => true, [])

  const { handleKeyDown } = useFieldRegistration({ type: 'inputNumberWithStepper', focus, shouldNavigate })

  let rules = formItemProps?.rules || []
  if (formItemProps?.required) {
    rules = rules.filter(v => v.required !== true)
    rules.push({
      required: true,
      message: '请输入' + formItemProps?.label + '！',
    })
  }

  const handleMinus = () => {
    if (disabled) return
    const next = (value ?? 0) - step
    if (min !== undefined && next < min) return
    onChange?.(next)
  }

  const handlePlus = () => {
    if (disabled) return
    const next = (value ?? 0) + step
    if (max !== undefined && next > max) return
    onChange?.(next)
  }

  return (
    <FormItem {...formItemProps} rules={rules} shouldUpdate label={undefined}>
      <div className='flex items-center'>
        <Button
          disabled={disabled || value <= min}
          onClick={() => handleMinus()}
        >
          <MinusOutlined />
        </Button>

        <AntdInputNumber
          className='!h-[25px]'
          {...omit(props, 'required', 'formItemProps')}
          ref={mergedRef}
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

        <Button

          disabled={disabled || value >= max}
          onClick={() => handlePlus()}
        >
          <PlusOutlined />
        </Button>
      </div>
    </FormItem>
  )
})

InputNumberWithStepper.displayName = 'InputNumberWithStepper'

export default InputNumberWithStepper
