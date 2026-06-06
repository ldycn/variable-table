import { omit } from 'lodash'
import { ReactNode } from 'react';

export interface TabProps extends React.ComponentProps<'div'> {
  /** 分区详情/表单组件 */
  tabs: Array<string | { disabled?: boolean; name: string, label: ReactNode }>
  tabProps?: React.ComponentProps<'div'> | ((name: string) => React.ComponentProps<'div'>)
  /** 界面事件:
   *
   * onTabChange：切换tab项的时间。
   *
   * beforeBack：返回false时将阻止返回上一页的操作
   */
  activeTabName: string
  size?: 'small'
  onChange?: (name: string) => void
}
const Tabs = (props: TabProps) => {
  return (
    <div
      {...omit(props, ['tabs', 'tabProps', 'activeTabName', 'onTabChange'])}
      className={'flex items-center overflow-x-auto hide-scrollbar ' + props.className}
    >
      {props.tabs.map(v => {
        let name: string
        let label: ReactNode

        if (typeof v === 'object') {
          name = v.name
          label = v.label ?? v.name
        } else {
          name = v
          label = v
        }

        return (
          <div
            {...(typeof props.tabProps === 'function'
              ? props.tabProps(name)
              : props.tabProps || {})}
            onClick={() => {
              if (props.tabProps?.onClick) {
                const doNext = props.tabProps?.onClick(name)
                if (doNext === false) {
                  return
                }
              }
              props.onChange?.(name)
            }}
            className={
              'cursor-pointer h-[36px] flex justify-center items-center text-[14px] mr-[16px] shrink-0 p-[12px] ' +
              (props.size !== 'small' ? 'min-w-[88px] ' : '') +
              (v.disabled ? 'text-[#BFBFBF] cursor-not-allowed pointer-events-none ' : ' ') +
              (name === props.activeTabName ? 'bg-[#F2F5FC] rounded-full text-[#0052D9] ' : '')
            }
          >
            {label}
          </div>
        )
      })}
    </div>
  )
}

export default Tabs
