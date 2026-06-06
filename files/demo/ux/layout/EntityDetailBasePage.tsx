import { Card } from 'antd'
import { ReactNode } from 'react'

export interface EntityListBasePageBaseProps {
  /** 页面标题 */
  title: ReactNode
  /** 界面操作。 */
  action: ReactNode
  /** 分区详情/表单组件 */
  blocks: { key?: string; node: ReactNode; grow?: number }[]
}

export interface EntityListBasePageProps extends EntityListBasePageBaseProps {
  /** 界面事件:
   *
   * beforeBack：返回false时将阻止返回上一页的操作
   */
  events?: {
    onSave?: () => Promise<any>
    beforeBack?: () => boolean | { isFormChanged: boolean; continue?: any } | Promise<boolean | { isFormChanged: boolean; continue?: any }>
  }
}
const EntityDetailPage = (props: EntityListBasePageProps) => {
  // const blocks = props.blocks.map(v => ({ ...v, key: IDGenerator.createRandomStringId() }))

  return (
    <div className='box-border  p-[16px] bg-[#F7F8FC] h-full w-full flex flex-col'>
      <Card
        className='w-full box-border h-[58px]'
        style={{ padding: 12 }}
        bodyStyle={{
          padding: 0,
          width: '100%',
          height: '100%'
        }}
      >
        <div className='w-full h-full box-border grow-0 flex items-center justify-between'>
          <div className='text-[18px] h-full flex items-center'>{props.title}</div>
          <div className='h-full flex justify-end items-center'>{props.action}</div>
        </div>
      </Card>
      <div className={`h-full overflow-auto mt-[16px] flex flex-col`}>
        {props.blocks.map((v, index) => (
          <div
            key={v.key}
            className={`w-full ` + (!!index ? `mt-[16px]` : '')}
            style={{
              flexGrow: v.grow,
              height: v.grow ? 0 : undefined
            }}
          >
            {v.node}
          </div>
        ))}
      </div>
    </div>
  )
}

export default EntityDetailPage
