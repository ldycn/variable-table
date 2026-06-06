import { LeftOutlined } from '@ant-design/icons'
import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import EntityDetailBasePage from './EntityDetailBasePage'

export interface EntityDetailPageProps {
  /** 实体名称，生成标题使用 */
  entityName: string
  /** 界面操作。 */
  action: ReactNode
  /** 分区详情/表单组件 */
  blocks: { node: ReactNode; grow?: number }[]
  /** 界面事件:
   *
   * onSave：add和edit模式下可以有onSave函数做保存用
   *
   * beforeBack：返回false时将阻止返回上一页的操作
   */
  events?: {
    beforeBack?: () => boolean | Promise<boolean>
  }
}
const EntityDetailPage = (props: EntityDetailPageProps) => {
  const navigate = useNavigate()
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
  return (
    <EntityDetailBasePage
      {...props}
      title={
        <>
          <div
            className='w-[32px] h-[32px] bg-[#DEDFE0] rounded-full flex justify-center items-center mr-[16px] cursor-pointer'
            onClick={onBack}
          >
            <LeftOutlined className='text-[24px] text-white ml-[-2px]' />
          </div>
          <div>{props.entityName}</div>
        </>
      }
    />
  )
}

export default EntityDetailPage
