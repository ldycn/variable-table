import { ReactNode } from 'react'

export interface PageHeaderProps {
  /** 页面标题 */
  title: ReactNode
  prefix?: ReactNode
  suffix?: ReactNode
  /** 界面操作。 */
  action?: ReactNode
  children?: ReactNode
  bottomLine?: boolean
}

const InlinePageHeader = (props: PageHeaderProps) => {
  return (
    <div
      className={
        'w-full box-border pb-[12px] grow-0 ' +
        (props.bottomLine !== false && 'border-b-[1px] border-solid border-[#DCDFE6]')
      }
    >
      <div className={'w-full flex items-center justify-between'}>
        <div className='text-[18px] h-full flex items-center pr-[16px]'>
          {props.prefix}
          {props.title}
          {props.suffix}
        </div>
        <div className='h-full flex justify-end items-center'>{props.action}</div>
      </div>
      {props.children}
    </div>
  )
}

export default InlinePageHeader
