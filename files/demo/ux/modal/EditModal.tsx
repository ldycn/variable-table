import { useAsyncEffect } from 'ahooks'
import Form, { FormInstance, FormProps, useForm } from 'antd/es/form/Form'
import { omit } from 'lodash'
import { ReactNode, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import Modal, { ModalProps } from '.'
import './index.css'

export interface EditModalProps extends Omit<ModalProps, 'onOk'> {
  afterOkClose?: () => void
  type?: 'edit' | 'add'
  formInstance?: FormInstance
  resetOnclose?: boolean
  onOk?: <T>(values: T) => boolean | void
  formProps?: FormProps
  init?: (values) => Promise<void> | void
}
const EditModal = (props: EditModalProps) => {
  const [form] = useForm(props.formInstance)
  const [open, setOpen] = useState(props.open || false)
  const isOk = useRef(false)
  const onClose = async () => {
    const doNext = await props.onClose?.()
    if (doNext !== false) {
      if (props.resetOnclose !== false) {
        form.resetFields()
      }
      setOpen(false)
    }
  }
  useAsyncEffect(async () => {
    if (!props.init) {
      return
    }
    const data = await props.init()
    form.setFieldsValue(data)
  }, [])
  const onCancel = async () => {
    const doNext = await props.onCancel?.()
    if (doNext !== false) {
      if (props.resetOnclose !== false) {
        form.resetFields()
      }
      setOpen(false)
    }
  }
  const onOk = async () => {
    try {
      await Promise.resolve()
      await form.validateFields()
      const doNext = await props.onOk?.(form.getFieldsValue())
      if (doNext !== false) {
        if (props.resetOnclose !== false) {
          form.resetFields()
        }
        isOk.current = true
        setOpen(false)
      }
    } catch (e) {}
  }
  const afterClose = async () => {
    if (isOk.current) {
      props.afterOkClose?.()
    }
    return props.afterClose?.()
  }

  return (
    <Form form={form} {...(props.formProps || {})}>
      <Modal
        {...props}
        title={props.title || (props.type === 'add' ? '新建' : '编辑')}
        open={open}
        onClose={onClose}
        onCancel={onCancel}
        afterClose={afterClose}
        onOk={onOk}
      >
        <div className='min-h-[112px] p-[16px] flex w-full'>{props.children}</div>
      </Modal>
    </Form>
  )
}

interface EditModalConfig extends Omit<EditModalProps, 'open'> {
  content: ReactNode
  type: 'edit' | 'add'
}

export const editModal = (config: EditModalConfig) => {
  const container = document.createElement('div')
  document.body.appendChild(container)

  const root = createRoot(container)
  root.render(
    <EditModal open {...omit(config, ['open', 'content', 'children'])}>
      {config.content}
    </EditModal>
  )
}
export default EditModal
