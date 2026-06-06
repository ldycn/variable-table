import BaseTableSelect, { TableSelectProps } from '@/ux/searcher/items/TableSelect/TableSelect'
import FormItem, { FormItemProps } from 'antd/es/form/FormItem'
import { omit } from 'lodash'

export interface TableSelectProps<T> extends Omit<TableSelectProps<T>, 'placeholder'> {
  /** 占位用,该组件继承antdSelectProps除了placeholder、prefix的部分。
   *
   * 由于antd select组件特性，多选模式下需要手动将最小宽度定为可以显示出placeholder宽度的宽度以保证placeholder不被掩盖。
   */
  _?: any
  /** 表单Key，组件会在对应form的values中添加[FORM_ATTR_PREFIX + props.key]属性，通过该属性可以直接调用该组件的getOptions方法。
   */
  /** formItem的Props */
  formItemProps?: FormItemProps
}

const TableSelect = <T,>(props: TableSelectProps<T>) => {
  let rules = props.formItemProps?.rules || []
  if (props.formItemProps?.required) {
    rules = rules.filter(v => v.required !== true)
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
      <BaseTableSelect<T>
        {...omit(props, ['formItemProps'])}
        selectProps={{
          maxTagTextLength: undefined,
          maxTagCount: undefined,
          placeholder: '请选择',
          className: 'w-full ' + props.className,
          ...(props.selectProps || {})
        }}
      />
    </FormItem>
  )
}

export default TableSelect
