import useSelect, { SelectOption } from '@/ux/searcher/items/useSelect'
import { Select as AntdSelect, SelectProps as AntdSelectProps } from 'antd'
import FormItem, { FormItemProps } from 'antd/es/form/FormItem'
import { omit } from 'lodash'

export interface SelectProps extends Omit<AntdSelectProps, 'placeholder'> {
  /** 占位用,该组件继承antdSelectProps除了placeholder、prefix的部分。
   *
   * 由于antd select组件特性，多选模式下需要手动将最小宽度定为可以显示出placeholder宽度的宽度以保证placeholder不被掩盖。
   */
  _?: any
  /** 表单Key，组件会在对应form的values中添加[FORM_ATTR_PREFIX + props.key]属性，通过该属性可以直接调用该组件的getOptions方法。
   */
  options?: SelectOption[]
  /** 获取options的函数,可以为普通function或者async function。*/
  getOptions?: () => SelectOption[] | Promise<SelectOption[]>
  /** 设置为true时会在组件加载阶段通过getOptions获取一次options。*/
  init?: boolean
  /** formItem的Props */
  formItemProps?: FormItemProps
  /** 自定义placeholder */
  placeholder?: string
}

const Select = (props: SelectProps) => {
  const { options } = useSelect({
    ...props,
    propsOptions: props.options,
    key: props.formItemProps?.name
  })
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
      <AntdSelect
        {...omit(props, ['options', 'placeholder', 'formItemProps', 'init', 'required'])}
        options={options}
        placeholder={props.placeholder || '请选择'}
        allowClear
        dropdownMatchSelectWidth={false}
        className={'w-full ' + props.className}
      />
    </FormItem>
  )
}

export default Select
