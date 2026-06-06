import CategorySelect from '@/shared_new/components/form/BaseCategorySelect'
import { FormItemProps } from 'antd'
import FormItem from 'antd/es/form/FormItem'

export interface CategoryFormItemProps {
  _?: any
  /** Form.Item 的配置 */
  formItemProps?: FormItemProps
}

const Category = (props: CategoryFormItemProps) => {
  const { formItemProps, ...restProps } = props

  let rules = formItemProps?.rules || []

  if (formItemProps?.required) {
    rules = rules.filter(rule => rule.required !== true)
    rules.push({
      required: true,
      message: `请选择${formItemProps?.label}！`
    })
  }

  return (
    <FormItem
      {...formItemProps}
      rules={rules}
      shouldUpdate
    >
      <CategorySelect {...restProps} />
    </FormItem>
  )
}

export default Category
