import { ReactNode } from 'react'
import { Tooltip } from 'antd'

export interface DetailProps {
  title: ReactNode
  content?: ReactNode
  labelWidth?: number | string
  valueWidth?: number | string
  maxLines?: number
}
const ItemDetail = (props: DetailProps) => {
  const { maxLines } = props

  const renderContent = () => {
    const content = props.content
    const contentStr = typeof content === 'string' ? content : String(content ?? '')

    if (maxLines && maxLines > 0) {
      return (
        <Tooltip title={contentStr}>
          <div
            className="overflow-hidden"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: maxLines,
              WebkitBoxOrient: 'vertical',
              wordBreak: 'break-all'
            }}
          >
            {props.content}
          </div>
        </Tooltip>
      )
    }

    return props.content
  }

  return (
    <div className='w-full flex items-start'>
      <div
        className='w-[40%] pt-[8px] text-[14px]/[18px] text-right'
        style={{ width: props.labelWidth }}
      >
        {props.title}：
      </div>
      <div
        className='w-[50%] bg-[#F2F5FC] px-[8px] min-h-[32px] py-[6px] text-[14px]/[18px] flex text-wrap grow-0 text-clip whitespace-pre-wrap break-all'
        style={{ width: props.valueWidth }}
      >
        {renderContent()}
      </div>
    </div>
  )
}

export default ItemDetail
