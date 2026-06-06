import { Card } from 'antd'
import { ReactNode } from 'react'

export interface PageHeaderProps {
  /** 页面标题 */
  title: ReactNode
  prefix?: ReactNode
  suffix?: ReactNode
  /** 界面操作。 */
  action?: ReactNode
  /** 分区详情/表单组件 */
  children?: ReactNode
  bottomLine?: boolean
}

const CardPageHeader = (props: PageHeaderProps) => {
  return (
    <Card
      className='w-full box-border'
      style={{ padding: 12 }}
      bodyStyle={{
        padding: 0,
        width: '100%',
        height: '100%'
      }}
    >
      <div className='w-full h-full box-border grow-0 flex items-center justify-between'>
        <div className='w-full h-full box-border grow-0 flex items-center justify-between'>
          <div className='text-[18px] h-full flex items-center'>
            {props.prefix}
            {props.title}
            {props.suffix}
          </div>
          <div className='h-full flex justify-end items-center'>{props.action}</div>
        </div>
      </div>
      {props.children}
    </Card>
  )
}

export default CardPageHeader
