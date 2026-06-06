import BaseDatePicker, {
  DatePickerProps as BaseDatePickerProps
} from '@/ux/searcher/items/DatePicker'
import FormItem, { FormItemProps } from 'antd/es/form/FormItem'
import { omit } from 'lodash'

export interface DatePickerProps extends Omit<BaseDatePickerProps, 'placeholder'> {
  /** 占位用,该组件继承antdSelectProps除了placeholder、prefix的部分。
   *
   * 由于antd select组件特性，多选模式下需要手动将最小宽度定为可以显示出placeholder宽度的宽度以保证placeholder不被掩盖。
   */
  _?: any
  /** formItem的Props */
  formItemProps?: FormItemProps
}

const DatePicker = (props: DatePickerProps) => {
  let rules = props.formItemProps?.rules || []
  if (props.formItemProps?.required) {
    rules = rules.filter(v => v.required !== true)
    rules.push({ required: true, message: '请填写' + props.formItemProps?.label + '！' })
  }

  return (
    <FormItem
      {...props.formItemProps}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      rules={rules}
      shouldUpdate
    >
      <BaseDatePicker
        {...omit(props, ['options', 'placeholder', 'prefix'])}
        searchName={''}
        prefix={''}
        allowClear
        bordered
        placeholder='请填写'
        className={'w-full ' + props.className}
      />
    </FormItem>
  )
}

export default DatePicker
