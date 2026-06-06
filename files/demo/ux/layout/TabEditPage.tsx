import IDGenerator from '@/utils/IDGenerator'
import { LeftOutlined } from '@ant-design/icons'
import { Card } from 'antd'
import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import Tabs, { TabProps } from '../tabs'

export interface TabEditPagePageBaseProps {
  tabProps: TabProps
  activeTabName: string
  /** 页面标题 */
  entityName: string
  /** 界面操作。 */
  action: ReactNode
  /** 分区详情/表单组件 */
  blocks: { node: ReactNode; grow?: number }[]
  type: 'add' | 'edit' | 'detail'
}

export interface TabEditPagePageProps extends TabEditPagePageBaseProps {
  /** 界面事件:
   *
   * beforeBack：返回false时将阻止返回上一页的操作
   */
  events?: {
    beforeBack?: () => boolean | Promise<boolean>
  }
}
const TabEditPage = (props: TabEditPagePageProps) => {
  const navigate = useNavigate()
  const blocks = props.blocks.map(v => ({ ...v, key: IDGenerator.createRandomStringId() }))
  const onBack = async () => {
    if (!props.events?.beforeBack) {
      navigate(-1)
      return
    }
    const doNext = await props.events.beforeBack()
    if (doNext) {
      navigate(-1)
    }
  }
  const typeMap = {
    add: `新建${props.entityName}`,
    edit: `编辑${props.entityName}`,
    detail: `${props.entityName}详情`
  }
  return (
    <div className='box-border  p-[16px] bg-[#F7F8FC] h-full w-full flex flex-col'>
      <Card
        className='w-full box-border shrink-0'
        style={{ padding: 12 }}
        bodyStyle={{
          padding: 0,
          width: '100%',
          height: '100%'
        }}
      >
        <div className='w-full box-border grow-0 flex items-center justify-between mb-[12px]'>
          <div className='text-[18px] h-full flex items-center'>
            <div
              className='w-[32px] h-[32px] bg-[#DEDFE0] rounded-full flex justify-center items-center mr-[16px] cursor-pointer'
              onClick={onBack}
            >
              <LeftOutlined className='text-[24px] text-white ml-[-2px]' />
            </div>
            {typeMap[props.type]}
          </div>
          <div className='h-full flex justify-end items-center'>{props.action}</div>
        </div>
        <Tabs {...props.tabProps} />
      </Card>
      <div className={`h-full overflow-auto mt-[16px] flex flex-col`}>
        {blocks.map((v, index) => (
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

export default TabEditPage
