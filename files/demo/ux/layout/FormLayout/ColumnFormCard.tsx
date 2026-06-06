import { Card } from 'antd'
import { ReactNode } from 'react'
import GridForm from './GridForm'

export interface EntityListPageProps {
  /** 实体名称，生成标题使用 */
  title: string
  /** 分区详情/表单组件 */
  formItems: (ReactNode | { colSpan?: number; comp: ReactNode })[]
  /** */
  columnCount?: number
  className?: string
  suffix?: ReactNode
  /** 界面事件:
   *
   * onSave：add和edit模式下可以有onSave函数做保存用
   *
   * beforeBack：返回false时将阻止返回上一页的操作
   */
  // events?: {
  //   onSave?: () => void
  //   beforeBack?: () => boolean | Promise<boolean>
  // }
}
const ColumnFormCard = (props: EntityListPageProps) => {
  return (
    <Card
      className={'w-full ' + props.className}
      bodyStyle={{
        padding: 0,
        width: '100%',
        height: '100%'
      }}
    >
      <div className='w-full box-border px-[16px] py-[14px] border-b-[1px] boder-b-[#EEEEEE] text-[14px] font-bold'>
        {props.title}
      </div>
      <GridForm className='py-[24px]' formItems={props.formItems} columnCount={props.columnCount} />
      {props.suffix}
    </Card>
  )
}

export default ColumnFormCard
