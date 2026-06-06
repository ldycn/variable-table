import Tabs, { TabProps } from '@/ux/tabs'
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
  tabProps: TabProps
  className?: string
}

const TabsCardPageHeader = (props: PageHeaderProps) => {
  return (
    <Card
      className='w-full box-border'
      style={{ padding: 12 }}
      bodyStyle={{
        padding: 0,
        width: '100%',
        height: 'fit-content'
      }}
    >
      <div className='w-full h-full box-border grow-0 flex items-center justify-between'>
        <div className='w-full h-full box-border grow-0 flex items-center justify-between'>
          <div className='text-[18px] h-full flex items-center'>
            {props.prefix}
            {props.title}
            {props.suffix}
          </div>
        </div>
      </div>
      <div className='w-full h-full box-border grow-0 flex items-center justify-between'>
        <Tabs {...props.tabProps} className={'mt-[8px] ' + props.className} />
        <div className='h-full flex justify-end items-center'>{props.action}</div>
      </div>
    </Card>
  )
}

export default TabsCardPageHeader
