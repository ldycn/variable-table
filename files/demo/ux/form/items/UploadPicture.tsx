import FormItem, { FormItemProps } from 'antd/es/form/FormItem'
import { omit } from 'lodash'
import BaseUploadPicture from '../table/items/UploadPicture'

interface UploadPictureProps {
  value?: { name?: string; url: string }
  onChange?: (value: { name?: string; url: string }) => void
  props?: {
    btn?: boolean
  }
  formItemProps?: FormItemProps
}
function UploadPicture(props: UploadPictureProps) {
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
      <BaseUploadPicture {...omit(props, ['formItemProps'])} />
    </FormItem>
  )
}
export default UploadPicture
