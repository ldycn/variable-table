import FormItem, { FormItemProps } from 'antd/es/form/FormItem'
import { omit } from 'lodash'
import BaseUpload from './BaseUpload'

interface UploadProps {
  value?: string
  onChange?: (value: string) => void
  props?: {
    btn?: boolean
  }
  formItemProps?: FormItemProps
  allowedExtensions?: string[]
}

function Upload(props: UploadProps) {
  let rules = props.formItemProps?.rules || []
  if (props.formItemProps?.required) {
    rules = rules.filter(v => (v as any).required !== true)
    rules.push({ required: true, message: '请选择' + props.formItemProps?.label + '！' })
  }

  return (
    <FormItem
      {...(props.formItemProps || {})}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      rules={rules}
      shouldUpdate
    >
      <BaseUpload {...omit(props, ['formItemProps'])} />
    </FormItem>
  )
}

export default Upload
