import { QuestionCircleFilled } from '@ant-design/icons'
import { Input as AntdInput, InputProps as AntdInputPorps, Spin, Tooltip } from 'antd'
import FormItem, { FormItemProps } from 'antd/es/form/FormItem'
import { omit } from 'lodash'
import { ReactNode } from 'react'

export interface InputProps extends Omit<AntdInputPorps, 'placeholder'> {
  /** 占位用,该组件继承antdInputProps除了placeholder的部分。 */
  _?: any
  /** formItem的Props */
  formItemProps?: FormItemProps
  placeholder?: string
  /** 加载状态 */
  loading?: boolean
  /** 标题后面的描述信息，可以是字符串或ReactNode */
  desc?: string | ReactNode
}
const Input = (props: InputProps) => {
  const maxLength = props.maxLength || 30
  let rules = props.formItemProps?.rules || []
  if (props.formItemProps?.required) {
    rules = rules.filter((v: any) => v.required !== true)
    rules.push({ required: true, message: '请输入' + props.formItemProps?.label + '！' })
  }
  rules.push({ max: maxLength, message: '输入内容超长！' })

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

  const inputElement = (
    <AntdInput
      {...omit(props, 'required', 'formItemProps', 'loading', 'desc')}
      allowClear
      onKeyDown={e => {
        if (e.key === 'Enter') {
          e.preventDefault()
        }
      }}
      maxLength={maxLength}
      showCount
      placeholder={props.placeholder || '请填写'}
      className={'w-full ' + props.className}
    />
  )

  return (
    <FormItem
      {...props.formItemProps}
      label={renderLabel()}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      rules={rules}
      shouldUpdate
    >
      {props.loading ? <Spin>{inputElement}</Spin> : inputElement}
    </FormItem>
  )
}

export default Input
