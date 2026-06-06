import { Card as AntdCard, CardProps as AntdCardProps } from 'antd'
import { omit } from 'lodash'

export interface CardProps extends AntdCardProps {
  /** 实体名称，生成标题使用 */
  title: string
  action?: string
}
const Card = (props: CardProps) => {
  return (
    <AntdCard
      bodyStyle={{
        padding: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      {...omit(props, ['children', 'title'])}
      className={'w-full ' + props.className}
    >
      {props.title && (
        <div className='w-full box-border px-[16px] py-[14px] border-b-[1px] boder-b-[#EEEEEE] flex justify-between items-center'>
          <div className='text-[14px] font-bold'>{props.title}</div>
          <div>{props.action}</div>
        </div>
      )}
      {props.children}
    </AntdCard>
  )
}

export default Card
