import { Button } from 'antd'
import FormItem, { FormItemProps } from 'antd/es/form/FormItem'
import { omit } from 'lodash'
import { ReactNode } from 'react'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import BaseUploadPicture from '../../items/BaseUploadPicture'
interface TinyImageUploaderProps {
  value?: string
  onChange?: (value: string) => void
  label?: ReactNode
  props?: {
    btn?: boolean
  }
  formItemProps?: FormItemProps
}
function TinyImageUploader(props: TinyImageUploaderProps) {
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
      <div className='flex items-center'>
        {props.value && (
          <PhotoProvider>
            <PhotoView src={props.value}>
              <Button type='link'>查看</Button>
            </PhotoView>
          </PhotoProvider>
        )}
        <BaseUploadPicture
          uploadProps={{
            listType: 'text',
            showUploadList: false
          }}
          {...omit(props, ['formItemProps'])}
          comp={(fileList, loading) => {
            return fileList.length < 1 ? (
              <Button disabled={loading} type='link'>
                上传
              </Button>
            ) : (
              <Button disabled={loading} type='link'>
                重新上传
              </Button>
            )
          }}
        />
        <div style={{ color: 'rgba(0,0,0,0.25)' }}>{props.label}</div>
      </div>
    </FormItem>
  )
}
export default TinyImageUploader
