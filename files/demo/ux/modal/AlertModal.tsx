import { omit } from 'lodash'
import { ReactNode, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import Modal, { ModalProps } from '.'
import './index.css'

export interface AlertModalProps extends ModalProps {
  afterOkClose?: () => void
}
const AlertModal = (props: AlertModalProps) => {
  const [open, setOpen] = useState(props.open || false)
  const isOk = useRef(false)
  const onClose = async () => {
    const doNext = await props.onClose?.()
    if (doNext !== false) {
      setOpen(false)
    }
  }
  const onCancel = async () => {
    const doNext = await props.onCancel?.()
    if (doNext !== false) {
      setOpen(false)
    }
  }
  const onOk = async () => {
    const doNext = await props.onOk?.()
    if (doNext !== false) {
      isOk.current = true
      setOpen(false)
    }
  }
  const afterClose = async () => {
    if (isOk.current) {
      props.afterOkClose?.()
    }
    return props.afterClose?.()
  }

  return (
    <Modal
      {...props}
      title={props.title || '提示'}
      open={open}
      onClose={onClose}
      onCancel={onCancel}
      afterClose={afterClose}
      onOk={onOk}
    >
      <div className='min-h-[112px] p-[16px]'>{props.children}</div>
    </Modal>
  )
}

interface AlertModalConfig extends Omit<AlertModalProps, 'open'> {
  content: ReactNode
}

export const alertModal = (config: AlertModalConfig) => {
  const container = document.createElement('div')
  document.body.appendChild(container)

  const root = createRoot(container)
  root.render(
    <AlertModal open {...omit(config, ['open', 'content', 'children'])}>
      {config.content}
    </AlertModal>
  )
}
export default AlertModal
