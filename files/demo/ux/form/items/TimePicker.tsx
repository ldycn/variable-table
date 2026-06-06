import BaseTimePicker, {
  TimePickerProps as BaseTimePickerProps
} from '@/ux/searcher/items/TimePicker'
import { FormItemProps } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { omit } from 'lodash'

export interface TimePickerProps extends BaseTimePickerProps {
  /** formItem的Props */
  formItemProps?: FormItemProps
}

const TimePicker = (props: TimePickerProps) => {
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
      <BaseTimePicker
        {...omit(props, ['options', 'placeholder', 'prefix'])}
        searchName={'请选择'}
        prefix=''
        bordered
      />
    </FormItem>
  )
}

export default TimePicker
