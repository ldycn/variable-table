import { Select as AntdSelect, SelectProps as AntdSelectProps } from 'antd'
import { isNil, omit } from 'lodash'
import useSelect, { SelectOption } from './useSelect'

export interface SelectProps extends Omit<AntdSelectProps, 'placeholder'> {
  /** 占位用,该组件继承antdSelectProps除了placeholder、prefix的部分。
   *
   * 由于antd select组件特性，多选模式下需要手动将最小宽度定为可以显示出placeholder宽度的宽度以保证placeholder不被掩盖。
   */
  _?: any
  /** 搜索范围名称列表，将作为placeholder和选择prefix展示 */
  searchName: string
  /** 表单Key，组件会在对应form的values中添加[FORM_ATTR_PREFIX + props.key]属性，通过该属性可以直接调用该组件的getOptions方法。
   */
  keyName?: string
  /**  Options比普通select options多了valueLabel属性，使用该属性组件可以分别单独设置dropdown的显示方式和选中后表单框文字的展示方式。
   * valueLabel表示表单框文字中显示的内容,该内容在超长时仍然会被切断。
   */
  options?: SelectOption[]
  /** 获取options的函数,可以为普通function或者async function。*/
  getOptions?: () => SelectOption[] | Promise<SelectOption[]>
  /** 设置为true时会在组件加载阶段通过getOptions获取一次options。*/
  init?: boolean
}

const createOptions = (originOptions): Promise<any[]> =>
  originOptions.map(v => {
    if (!v.valueLabel && typeof v.label !== 'string') {
      return { ...v, labelInValue: v.label }
    }
    const text = v.valueLabel || v.label
    return { ...v, labelInValue: text.length > 9 ? text.slice(0, 9) + '...' : text.slice(0, 9) }
  })

const Select = (props: SelectProps) => {
  const getOptions = async () => {
    if (props.getOptions) {
      const options = (await props.getOptions()) || []
      return createOptions(options)
    }
    return []
  }
  const { options } = useSelect({
    ...props,
    getOptions,
    propsOptions: props.options,
    key: props.keyName
  })

  return (
    <AntdSelect
      bordered={false}
      {...omit(props, ['options', 'placeholder', 'prefix'])}
      tagRender={props => {
        if (props.isMaxTag) return <>{props.label}</>
        return <>{props.label + ','}</>
      }}
      options={options}
      placeholder={props.searchName}
      maxTagTextLength={10}
      maxTagCount={1}
      allowClear={props.allowClear ?? true}
      dropdownMatchSelectWidth={false}
      optionLabelProp='labelInValue'
      prefix={
        (Array.isArray(props.value) ? props.value.length > 0 : !isNil(props.value))
          ? props.searchName + ':'
          : undefined
      }
      dropdownStyle={{
        minWidth: 100,
        maxWidth: 300
      }}
    />
  )
}

export default Select
