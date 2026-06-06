import { Switch as AntdSwitch, SwitchProps as AntdSwitchPorps, FormItemProps } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { omit } from 'lodash'

export interface SwitchProps extends AntdSwitchPorps {
  /** 占位用,该组件继承antdSwitchProps除了placeholder的部分。 */
  _?: any
  searchName?: string
  /** formItem的Props */
  formItemProps?: FormItemProps
}
const Switch = (props: SwitchProps) => {
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
      <AntdSwitch {...omit(props, ['searchName'])} />
    </FormItem>
  )
}

export default Switch
