import { ReactNode } from 'react'

const DEFAULT_COLUMN_COUNT = 5
export interface EntityListPageProps {
  /** 分区详情/表单组件 */
  formItems: (ReactNode | { colSpan?: number; comp: ReactNode })[]
  /** */
  columnCount?: number
  className?: string
  verticalGap?: number
  size?: 'small'
}
const isConfigItem = (
  v: ReactNode | { colSpan?: number; comp: ReactNode }
): v is { colSpan?: number; comp: ReactNode } => {
  return !!(v as any).comp
}

const GridForm = (props: EntityListPageProps) => {
  return (
    <div
      className={'w-[full] mt-[-24px] flex flex-wrap ' + props.className}
      style={{ marginTop: props.verticalGap || undefined }}
    >
      {props.formItems.map((v, index) => {
        const isConfig = isConfigItem(v)
        const Comp = isConfig ? v.comp : v
        return (
          <div
            className={props.size === 'small' ? '' : 'mt-[24px]'}
            style={{
              width: `${
                (100 * (isConfig && v.colSpan ? v.colSpan : 1)) /
                (props.columnCount || DEFAULT_COLUMN_COUNT)
              }%`,
              paddingLeft: `${100 / (props.columnCount || DEFAULT_COLUMN_COUNT) / 10}%`,
              paddingRight: `${100 / (props.columnCount || DEFAULT_COLUMN_COUNT) / 10}%`,
              marginTop: props.verticalGap || undefined
            }}
          >
            <div className='ml-[12px]'>{Comp}</div>
          </div>
        )
      })}
    </div>
  )
}

export default GridForm
