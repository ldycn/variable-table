import { Checkbox as AntdCheckbox, CheckboxProps as AntdCheckboxProps } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { omit } from 'lodash'

export interface CheckboxProps extends AntdCheckboxProps {
  /** 占位用,该组件继承antdCheckboxProps除了placeholder的部分。 */
  _?: any
  /** 表单宽度，需要指定，宽度需要能尽量付改大多数情况的输入长度，并使placeholder能完整展示。不输入的话默认100 */
  width?: number
  searchName?: string
  /** 表单字段key，如果不传则使用searchName */
  fieldKey?: string
}
const Checkbox = (props: CheckboxProps) => {
  const fieldKey = props.fieldKey || props.searchName
  return (
    <FormItem noStyle shouldUpdate>
      {({ getFieldValue, setFieldValue }) => {
        const checked = getFieldValue(fieldKey)
        return (
          <div className='w-fit flex justify-center items-center'>
            <AntdCheckbox
              {...omit(props, ['searchName', 'fieldKey', 'checked', 'onChange'])}
              checked={checked}
              onChange={e => {
                setFieldValue(fieldKey, e.target.checked)
                props.onChange?.(e)
              }}
            >
              {props.searchName}
            </AntdCheckbox>
          </div>
        )
      }}
    </FormItem>
  )
}

export default Checkbox
