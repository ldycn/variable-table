import { DayPickerProps as BaseDayPickerProps } from '@/ux/searcher/items/DayPicker'
import { Button, Radio } from 'antd'
import FormItem, { FormItemProps } from 'antd/es/form/FormItem'
import useFormInstance from 'antd/es/form/hooks/useFormInstance'
import { omit, pick } from 'lodash'

export interface DayPickerProps extends Omit<BaseDayPickerProps, 'placeholder'> {
  /** 占位用,该组件继承antdSelectProps除了placeholder、prefix的部分。
   *
   * 由于antd select组件特性，多选模式下需要手动将最小宽度定为可以显示出placeholder宽度的宽度以保证placeholder不被掩盖。
   */
  _?: any
  /** formItem的Props */
  formItemProps?: FormItemProps
  unit?: Array<'week' | 'month'>
  disabled?: boolean
}

const Block = props => (
  <Button
    type={props.checked ? 'primary' : 'default'}
    {...omit(props, ['disabled'])}
    disabled={props.disabled}
    className={
      'shrink-0 ' + (props.disabled && props.checked ? '!bg-black/40 ' : ' ') + props.className
    }
  />
)
const weekDayOptions = [
  {
    value: 1,
    label: '周一'
  },
  {
    value: 2,
    label: '周二'
  },
  {
    value: 3,
    label: '周三'
  },
  {
    value: 4,
    label: '周四'
  },
  {
    value: 5,
    label: '周五'
  },
  {
    value: 6,
    label: '周六'
  },
  {
    value: 7,
    label: '周日'
  }
]

const optionConfigs = {
  week: {
    value: 'week',
    label: '周'
  },
  month: {
    value: 'month',
    label: '月'
  }
}
const DayPickerComp = (props: DayPickerProps) => {
  const options = props.unit ? props.unit.map(v => optionConfigs[v]) : Object.values(optionConfigs)
  return (
    <div>
      {(props.unit?.length > 1 || !props.unit) && (
        <Radio.Group
          value={props.value?.type}
          disabled={props.disabled}
          onChange={v => {
            props.onChange({
              type: v.target.value,
              days: []
            })
          }}
          options={options}
        >
          {/* {options.map(v => (
            <Radio value={v.value}>{v.label}</Radio>
          ))} */}
        </Radio.Group>
      )}
      <div className='w-full flex items-center flex-wrap'>
        {(props.value?.type === 'week' || (props.unit?.length === 1 && props.unit[0] === 'week')) &&
          weekDayOptions.map(v => (
            <Block
              disabled={props.disabled}
              className={'mr-[8px] mt-[8px]'}
              key={v.value}
              checked={props.value?.days?.includes(v.value)}
              onClick={() => {
                const key = v.value
                const checked = props.value?.days?.includes(key)
                props.onChange({
                  type: 'week',
                  days: checked
                    ? props.value?.days?.filter(v => v !== key)
                    : [...(props.value?.days || []), key]
                })
              }}
            >
              {v.label}
            </Block>
          ))}
        {(props.value?.type === 'month' ||
          (props.unit?.length === 1 && props.unit[0] === 'month')) &&
          new Array(31).fill(1).map((_, index) => (
            <Block
              disabled={props.disabled}
              className={'mr-[8px] !mt-[8px] w-[40px]'}
              key={index + 1}
              checked={props.value?.days?.includes(index + 1)}
              onClick={() => {
                const key = index + 1
                const checked = props.value?.days?.includes(key)
                props.onChange({
                  type: 'month',
                  days: checked
                    ? props.value?.days?.filter(v => v !== key)
                    : [...(props.value?.days || []), key]
                })
              }}
            >
              {index + 1}
            </Block>
          ))}
      </div>
    </div>
  )
}

const DayPicker = (props: DayPickerProps) => {
  const form = useFormInstance()
  let rules = props.formItemProps?.rules || []
  if (props.formItemProps?.required) {
    rules = rules.filter(v => (v as any).required !== true)
    rules.push({
      validator: (_, v) => {
        const valid = !!v.days?.length
        if (valid) {
          return Promise.resolve()
        }
        return Promise.reject(new Error('请选择' + props.formItemProps?.label + '！'))
      },
      message: '请选择' + props.formItemProps?.label + '！'
    })
  }

  return (
    <FormItem
      {...{
        ...props.formItemProps,
        label:
          props.unit?.length === 1
            ? `${props.formItemProps?.label}（每${optionConfigs[props.unit[0]]?.label}）`
            : props.formItemProps?.label
      }}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      rules={rules}
      shouldUpdate
    >
      <DayPickerComp onChange={props.onChange} {...pick(props, ['disabled', 'unit'])} />
    </FormItem>
  )
}

export default DayPicker
