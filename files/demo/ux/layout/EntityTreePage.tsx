import Table, { TableProps } from '@/shared_new/components/table'
import { Alert, AlertProps, Card } from 'antd'
import { ReactNode } from 'react'
import { SearchBarProps } from './SearchBar'

export interface EntityListPageProps<T, F> {
  /** 实体名称，生成标题使用 */
  entityName: string
  /** 界面操作组件,占用标题剩余的右侧空间。 */
  action: ReactNode
  /** 表格搜索组件。高度可随子组件变化 */
  searchBarProps: SearchBarProps<T>
  /** 表格组件,高度会充满剩余空间。 */
  tableProps: TableProps<T, F>
  /** 表格组件,高度会充满剩余空间。 */
  alertProps?: AlertProps
  /** 列表左侧区域 */
  Sider?: ReactNode
  tableId?: string
}
const EntityListPage = <T, F>(props: EntityListPageProps<T, F>) => {
  return (
    // <UserConfigProvider>
    <div className='box-border p-[16px] bg-[#F7F8FC] h-full w-full'>
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
        <div
          className={
            'w-full box-border h-[45px] pb-[12px] grow-0 flex items-center justify-between ' +
            (!props.alertProps && 'border-b-[1px] border-solid border-[#DCDFE6]')
          }
        >
          <div className='text-[18px] h-full flex items-center pr-[16px]'>{props.entityName}</div>
          <div className='h-full flex justify-end items-center'>{props.action}</div>
        </div>
        {props.alertProps && (
          <div className='w-full grow-0'>
            <Alert {...props.alertProps} />
          </div>
        )}
        <div className='w-full h-[0] grow flex items-stretch'>
          {props.Sider || null}
          {props.Sider && <div className='h-full w-[1px] mx-[16px] bg-[#DCDFE6]' />}
          <div className='w-[0] h-full grow flex flex-col '>
            <Table
              id={props.tableId}
              tableProps={props.tableProps}
              searchBarProps={props.searchBarProps}
            />
          </div>
        </div>
      </Card>
    </div>
    // </UserConfigProvider>
  )
}

export default EntityListPage
