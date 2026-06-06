import { Checkbox as AntdCheckbox, CheckboxProps as AntdCheckboxProps } from 'antd'
import FormItem from 'antd/es/form/FormItem'

export interface CheckboxGroupOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface CheckboxGroupProps extends Omit<AntdCheckboxProps, 'options'> {
  /** 占位用 */
  _?: any
  /** 选项列表 */
  options: CheckboxGroupOption[]
  /** 搜索范围名称 */
  searchName?: string
  /** 表单字段key */
  fieldKey?: string
}

const CheckboxGroup = (props: CheckboxGroupProps) => {
  const fieldKey = props.fieldKey || props.searchName
  const { options, searchName } = props

  return (
    <FormItem noStyle shouldUpdate>
      {({ getFieldValue, setFieldValue }) => {
        const selectedValues = getFieldValue(fieldKey) || []

        return (
          <div className='flex items-center gap-4'>
            {searchName && <span className='text-gray-600'>{searchName}：</span>}
            <div className='flex items-center gap-6'>
              {options.map(option => {
                const isChecked = selectedValues.includes(option.value)
                return (
                  <label
                    key={option.value}
                    className={`flex items-center gap-2 ${option.disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:opacity-80'}`}
                  >
                    <AntdCheckbox
                      checked={isChecked}
                      disabled={option.disabled}
                      onChange={e => {
                        const newValues = e.target.checked
                          ? [...selectedValues, option.value]
                          : selectedValues.filter((v: any) => v !== option.value)
                        setFieldValue(fieldKey, newValues)
                        props.onChange?.(newValues)
                      }}
                    />
                    {option.label}
                  </label>
                )
              })}
            </div>
          </div>
        )
      }}
    </FormItem>
  )
}

export default CheckboxGroup
