import { ColumnProps } from 'antd/es/table'

export const getSerialNumberColumnConfig = () => ({
  dataIndex: '__serialNumber__',
  title: <div className='w-full inline-flex justify-center'>Index</div>,
  resizeable: false,
  fixed: 'left' as ColumnProps['fixed'],
  width: 50,
  render(v) {
    return <div className='flex w-full justify-center'>{v}</div>
  }
})
