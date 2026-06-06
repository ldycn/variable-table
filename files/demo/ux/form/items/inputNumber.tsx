import { QuestionCircleFilled } from '@ant-design/icons'
import {
  InputNumber as AntdInputNumber,
  InputNumberProps as AntdInputNumberPorps,
  Form,
  Tooltip
} from 'antd'
import { FormItemProps } from 'antd/es/form/FormItem'
import { omit } from 'lodash'
import { ReactNode } from 'react'

export interface InputProps extends Omit<AntdInputNumberPorps, 'placeholder'> {
  /** 占位用,该组件继承antdInputProps除了placeholder的部分。 */
  _?: any
  /** formItem的Props */
  formItemProps?: FormItemProps
  valueRender?: () => string
  /** 标题后面的描述信息，可以是字符串或ReactNode */
  desc?: string | ReactNode
}
const InputNumber = (props: InputProps) => {
  let rules = props.formItemProps?.rules || []
  if (props.formItemProps?.required) {
    rules = rules.filter(v => (v as any).required !== true)
    rules.push({ required: true, message: '请输入' + props.formItemProps?.label + '！' })
  }

  const renderLabel = (): ReactNode => {
    const label = props.formItemProps?.label
    if (!props.desc) return label
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {label}
        <Tooltip title={props.desc}>
          <QuestionCircleFilled />
        </Tooltip>
      </span>
    )
  }

  if (props.valueRender) {
    return (
      <Form.Item shouldUpdate={props.formItemProps?.shouldUpdate || true}>
        {() => (
          <Form.Item
            {...props.formItemProps}
            label={renderLabel()}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            rules={rules}
          >
            <AntdInputNumber
              {...omit(props, 'required', 'formItemProps', 'desc')}
              placeholder={'请填写'}
              onKeyDown={e => {
                e.stopPropagation()
                if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                  e.preventDefault()
                }
              }}
              value={props.valueRender()}
              controls={false}
              className={'w-full ' + props.className}
            />
          </Form.Item>
        )}
      </Form.Item>
    )
  }
  return (
    <Form.Item
      {...props.formItemProps}
      label={renderLabel()}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      rules={rules}
    >
      <AntdInputNumber
        {...omit(props, 'required', 'formItemProps', 'desc')}
        placeholder={'请填写'}
        onKeyDown={e => {
          e.stopPropagation()
          if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault()
          }
        }}
        controls={false}
        className={'w-full ' + props.className}
      />
    </Form.Item>
  )
}

export default InputNumber
