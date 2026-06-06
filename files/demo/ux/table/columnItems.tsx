import { ExclamationCircleOutlined, QuestionCircleFilled } from '@ant-design/icons'
import AuthButton from '@shared/components/auth-button'
import { ButtonProps, Modal, Popover } from 'antd'
import { ColumnProps } from 'antd/es/table'
import { ReactNode } from 'react'

const COLUMN_NAME_PREFIX = '__columns__'

export const getSerialNumberColumnConfig = () => ({
  dataIndex: '__serialNumber__',
  title: <div className='w-full inline-flex justify-center'>序号</div>,
  resizeable: false,
  fixed: 'left' as ColumnProps['fixed'],
  width: 50,
  render(v) {
    return <div className='flex w-full justify-center'>{v}</div>
  }
})

export const getActionColumnConfig = (getButtons: (...args: any[]) => ReactNode[]) => ({
  dataIndex: COLUMN_NAME_PREFIX + 'action',
  title: '操作',
  fixed: 'right' as ColumnProps['fixed'],
  render(...args) {
    const ViewButton = (props: ButtonProps & { onClick: (value, record, index) => void }) => (
      <AuthButton {...props} type={'link'} onClick={() => props.onClick(...args)}>
        详情
      </AuthButton>
    )
    const EditButton = (props: ButtonProps & { onClick: (value, record, index) => void }) => (
      <AuthButton {...props} type={'link'} onClick={() => props.onClick(...args)}>
        编辑
      </AuthButton>
    )
    const DeleteButton = (props: ButtonProps & { onConfirm: (value, record, index) => void }) => (
      <AuthButton
        {...props}
        type={'link'}
        danger
        onClick={() => {
          Modal.confirm({
            title: '确认删除？',
            icon: <ExclamationCircleOutlined className='text-[#faad14]' />,
            content: (
              <div className='leading-6 text-[#4c4c4c]'>
                <div className='font-medium text-[#262626]'>此操作不可恢复，请谨慎操作</div>
              </div>
            ),
            centered: false,
            style: { top: 160 },
            okText: '确定',
            cancelText: '取消',
            okButtonProps: { danger: true },
            onOk: () => {
              props.onConfirm(...args)
            }
          })
        }}
      >
        删除
      </AuthButton>
    )
    return (
      <div className='flex flex-wrap items-center'>
        {getButtons(...args, { ViewButton, EditButton, DeleteButton })}
      </div>
    )
  }
})

export const getNumberColumnConfig = () => ({
  align: 'right' as const
})

export interface LongTextColumnConfig {
  popupValue?: (value: any) => ReactNode
}

export const getLongTextColumnConfig = (config?: LongTextColumnConfig) => ({
  // ellipsis: true,
  render: value => {
    const content = config?.popupValue ? config.popupValue(value) : value
    return (
      <Popover placement='top' content={content}>
        <div className='ellipsis w-full'>{value}</div>
      </Popover>
    )
  }
})

export const TIME_COLUMN_WIDTH = 170

export const tipTitle =
  ({ title, tip }) =>
  () => (
    <div className='inline-flex items-center'>
      <span className='mr-[8px]'>{title}</span>
      <Popover placement='top' content={tip}>
        <QuestionCircleFilled />
      </Popover>
    </div>
  )
