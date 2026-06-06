import Tabs from '@/ux/tabs'
import { Card } from 'antd'
import { ReactNode } from 'react'

export interface TabFormCardProps {
  /** 分区详情/表单组件 */
  tabs: Array<{
    name: string
    label?: ReactNode
    comp: ReactNode
    active?: boolean
  }>
  activeTabName: string
  /** */
  action?: ReactNode
  className?: string
  /** 界面事件:
   *
   * onTabChange：切换tab项的时间。
   *
   * beforeBack：返回false时将阻止返回上一页的操作
   */
  events?: {
    onTabChange?: (name: string) => void
  }
}
const TabFormCard = (props: TabFormCardProps) => {
  return (
    <Card
      {...props}
      className={'w-full box-border ' + props.className}
      bodyStyle={{
        padding: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div className='px-[16px] py-[14px] w-full flex grow-0 justify-between'>
        <Tabs
          tabs={props.tabs.map(v => ({
            name: v.name,
            label: v.label ?? v.name
          }))}
          activeTabName={props.activeTabName}
          onChange={name => props.events?.onTabChange?.(name)}
        />
        {props.action}
      </div>
      <div className='h-0 grow'>
        {props.tabs.map(tab => (
          <div
            key={tab.name}
            className='h-full'
            style={{
              display: tab.name === props.activeTabName ? 'flex' : 'none',
              flexDirection: 'column'
            }}
          >
            {tab.comp}
          </div>
        ))}
      </div>
    </Card>
  )
}

export default TabFormCard
