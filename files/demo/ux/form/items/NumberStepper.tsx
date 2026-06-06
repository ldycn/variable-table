import { Button, Form } from 'antd'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import InputNumber, { InputProps } from './inputNumber'

interface InputNumberWithStepperProps extends InputProps {
  step?: number
  min?: number
  max?: number
}

const InputNumberWithStepper = (props: InputNumberWithStepperProps) => {
  const {
    step = 1,
    min = -Infinity,
    max = Infinity,
    formItemProps,
    disabled,
  } = props

  const form = Form.useFormInstance()
  const name = formItemProps?.name
  const value = Form.useWatch(name, form)

  const updateValue = (next: number) => {
    if (next < min || next > max) return
    form.setFieldValue(name, next)
  }

  return (
    <Form.Item
      {...formItemProps}
      labelAlign="left"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Button
          className='w-8 !mt-[-24px]'
          disabled={disabled || value <= min}
          onClick={() => updateValue((value ?? 0) - step)}
        >
          <MinusOutlined />
        </Button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <InputNumber
            {...props}
            noFormItem
            value={value}
            formItemProps={undefined}
            onChange={(v) => form.setFieldValue(name, v)}
            className="w-full"
          />
        </div>

        <Button
          className='w-8 !mt-[-24px]'
          disabled={disabled || value >= max}
          onClick={() => updateValue((value ?? 0) + step)}
        >
          <PlusOutlined />
        </Button>
      </div>
    </Form.Item>
  )
}

export default InputNumberWithStepper
