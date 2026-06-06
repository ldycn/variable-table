import { RangePickerProps as BaseRangePickerProps } from '@/ux/searcher/items/RangePicker'
import { DatePicker } from 'antd'
import FormItem, { FormItemProps } from 'antd/es/form/FormItem'

interface RangePickerProps extends BaseRangePickerProps {
  /** formItem的Props */
  formItemProps?: FormItemProps
}
export default function RangePicker(props: RangePickerProps) {
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
      <DatePicker.RangePicker placeholder={['请选择', '请选择']} prefix={''} {...props} bordered />
    </FormItem>
  )
}
