import { CloseOutlined } from '@ant-design/icons'
import { Modal as AntdModal, ModalProps as AntdModalProps, Button, ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import { omit } from 'lodash'
import React, { ReactNode, useContext, useImperativeHandle, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

export interface ModalProps extends Omit<AntdModalProps, 'onCancel' | 'onOk' | 'onClose'> {
  footerLeft?: ReactNode
  footer?: boolean | ReactNode
  content?: ReactNode
  ref?: React.Ref<{ close: () => void }>
  onClose?: () => Promise<boolean | void> | boolean | void
  onCancel?: () => Promise<boolean | void> | boolean | void
  onOk?: () => Promise<boolean | void> | boolean | void
}
const Modal = React.forwardRef<{ close: () => void }, ModalProps>((props, ref) => {
  useContext(ConfigProvider.ConfigContext)

  const [open, setOpen] = useState(props.open ?? true)

  useImperativeHandle(ref, () => ({
    close: () => setOpen(false)
  }))

  const handleClose = async () => {
    const doNext = await props.onClose?.()
    if (doNext !== false) {
      setOpen(false)
    }
  }

  const handleCancel = async () => {
    const doNext = await props.onCancel?.()
    if (doNext !== false) {
      setOpen(false)
    }
  }

  const handleOk = async () => {
    const doNext = await props.onOk?.()
    if (doNext !== false) {
      setOpen(false)
    }
  }

  let footer: ReactNode = (
    <div className='h-[48px] w-full border-t border-t-[#DCDFE6] flex justify-between items-center'>
      <div className='w-0 grow ml-[16px]'>{props.footerLeft}</div>
      <div className='mx-[16px] flex items-center'>
        <Button onClick={handleCancel}>取消</Button>
        <Button htmlType='submit' onClick={handleOk} type='primary' className='ml-[12px]'>
          {props.okText || '确定'}
        </Button>
      </div>
    </div>
  )
  if (props.footer === false) {
    footer = null
  } else if (typeof props.footer !== 'undefined' && typeof props.footer !== 'boolean') {
    footer = props.footer
  }
  return (
    <ConfigProvider locale={zhCN} componentSize='small'>
      <AntdModal
        open={open}
        maskClosable={true}
        {...omit(props, ['title', 'content', 'footer', 'onOk', 'onClose', 'onCancel', 'open'])}
        className='__ux__modal__'
        title={null}
        footer={null}
        closeIcon={null}
      >
        <div className='h-[48px] w-full border-b border-b-[#DCDFE6] flex justify-between items-center'>
          <div className='pl-[16px] text-[16px] w-0 grow'>{props.title}</div>
          <CloseOutlined className='mx-[16px] text-[24] cursor-pointer' onClick={handleClose} />
        </div>
        <div className='w-full'>{props.children}</div>
        {footer}
      </AntdModal>
    </ConfigProvider>
  )
})
export const modal = (config: ModalProps): { close: () => void } => {
  const container = document.createElement('div')
  document.body.appendChild(container)

  let closeFn: () => void

  const root = createRoot(container)
  root.render(
    <Modal
      ref={instance => {
        closeFn = instance?.close
      }}
      open
      {...omit(config, ['open', 'content', 'children'])}
    >
      {config.content}
    </Modal>
  )

  return {
    close: () => closeFn?.()
  }
}

export default Modal
