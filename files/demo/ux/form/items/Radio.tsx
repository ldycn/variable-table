import { QuestionCircleFilled } from '@ant-design/icons'
import { Radio as AntdRadio, FormItemProps, RadioGroupProps, Tooltip } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { omit } from 'lodash'
import { ReactNode } from 'react'

export interface RadioProps extends RadioGroupProps {
  /** 占位用,该组件继承antdRadioProps除了placeholder的部分。 */
  _?: any
  searchName?: string
  /** formItem的Props */
  formItemProps?: FormItemProps
  /** 标题后面的描述信息，可以是字符串或ReactNode */
  desc?: string | ReactNode
}
const Radio = (props: RadioProps) => {
  let rules = props.formItemProps?.rules || []
  if (props.formItemProps?.required) {
    rules = rules.filter(v => (v as any).required !== true)
    rules.push({ required: true, message: '请选择' + props.formItemProps?.label + '！' })
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

  return (
    <FormItem
      {...props.formItemProps}
      label={renderLabel()}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      rules={rules}
      shouldUpdate
    >
      <AntdRadio.Group {...omit(props, ['searchName', 'formItemProps', 'desc'])} />
    </FormItem>
  )
}

export default Radio
