import { DatePicker, TimeRangePickerProps } from 'antd'
import { RangePickerProps as AntdRangePickerProps } from 'antd/es/date-picker'
import dayjs from 'dayjs'

const rangePresets: TimeRangePickerProps['presets'] = [
  { label: '今天', value: [dayjs().startOf('day'), dayjs().endOf('day')] },
  {
    label: '昨天',
    value: [dayjs().add(-1, 'd').startOf('day'), dayjs().add(-1, 'd').endOf('day')]
  },
  {
    label: '过去7天',
    value: [dayjs().add(-7, 'd').startOf('day'), dayjs().endOf('day')]
  },
  {
    label: '过去15天',
    value: [dayjs().add(-15, 'd').startOf('day'), dayjs().endOf('day')]
  },
  {
    label: '过去30天',
    value: [dayjs().add(-30, 'd').startOf('day'), dayjs().endOf('day')]
  },
  {
    label: '本月',
    value: [dayjs().startOf('month'), dayjs().endOf('month')]
  },
  {
    label: '上月',
    value: [dayjs().add(-1, 'month').startOf('month'), dayjs().add(-1, 'month').endOf('month')]
  }
]

export interface RangePickerProps extends AntdRangePickerProps {
  showRangePresets?: boolean
  searchName?: string
}
export default function RangePicker (props: RangePickerProps) {
  return (
    <DatePicker.RangePicker
      bordered={false}
      className={props.value?.length ? '' : 'w-[250px]'}
      placeholder={['起始' + props.searchName, '终止' + props.searchName]}
      prefix={props.value?.length ? props.searchName + ':' : ''}
      inputReadOnly
      showTime={
        props.showTime ? { defaultValue: [dayjs().startOf('day'), dayjs().endOf('day')] } : false
      }
      presets={props.showRangePresets ? rangePresets : []}
      allowClear
      {...props}
    />
  )
}
