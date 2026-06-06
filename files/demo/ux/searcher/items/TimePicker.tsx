import { TimePicker as AntdTimePicker, TimePickerProps as AntdTimePickerProps } from 'antd'
import { omit } from 'lodash'

export interface TimePickerProps extends Omit<AntdTimePickerProps, 'placeholder'> {
  /** 占位用,该组件继承antdSelectProps除了placeholder、prefix的部分。
   *
   * 由于antd select组件特性，多选模式下需要手动将最小宽度定为可以显示出placeholder宽度的宽度以保证placeholder不被掩盖。
   */
  _?: any
  /** 搜索范围名称列表，将作为placeholder和选择prefix展示 */
  searchName: string
}

const TimePicker = (props: TimePickerProps) => {
  return (
    <AntdTimePicker
      bordered={false}
      placeholder={props.searchName}
      allowClear
      prefix={
        typeof props.prefix !== 'undefined'
          ? props.prefix
          : (Array.isArray(props.value) ? props.value.length : props.value)
          ? props.searchName + ':'
          : undefined
      }
      {...omit(props, ['options', 'placeholder', 'prefix'])}
    />
  )
}

export default TimePicker
