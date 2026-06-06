import Table, { TableProps } from '@/shared_new/components/table'
import { Alert, AlertProps, Card } from 'antd'
import { ReactNode } from 'react'
import { SearchBarProps } from './SearchBar'

export interface SimpleListPageProps<T, F> {
  /** 界面操作组件,占用顶部右侧空间。 */
  action?: ReactNode
  /** 表格搜索组件。高度可随子组件变化 */
  searchBarProps: SearchBarProps<T>
  /** 表格组件,高度会充满剩余空间。 */
  tableProps: TableProps<T, F>
  /** 表格组件,高度会充满剩余空间。 */
  alertProps?: AlertProps
  /** 列表左侧区域 */
  Sider?: ReactNode
  tableId?: string
  /** */
  contentList?: ReactNode,
  onColumnsChange?: (columns: any[]) => void
}

const SimpleListPage = <T, F> (props: SimpleListPageProps<T, F>) => {
  return (
    <Card
      className='h-full w-full py-[12px] px-[16px]'
      bodyStyle={{
        padding: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {props.action && (
        <div
          className={
            'w-full box-border h-[45px] pb-[12px] grow-0 flex items-center justify-end '
          }
        >
          <div className='h-full flex justify-end items-center'>{props.action}</div>
        </div>
      )}
      {props.alertProps && (
        <div className='w-full grow-0'>
          <Alert {...props.alertProps} />
        </div>
      )}
      <div className='w-full h-[0] grow flex items-stretch'>
        {props.Sider || null}
        {props.Sider && <div className='h-full w-[1px] mx-[16px] bg-[#DCDFE6]' />}
        <div className='w-[0] h-full grow flex flex-col'>
          {props.contentList || (
            <Table
              id={props.tableId}
              tableProps={props.tableProps}
              searchBarProps={props.searchBarProps}
              onColumnsChange={props.onColumnsChange}
            />
          )}
        </div>
      </div>
    </Card>
  )
}

export default SimpleListPage