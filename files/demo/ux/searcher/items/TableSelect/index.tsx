import TableSelect, { TableSelectProps as BaseTableSelectProps } from './TableSelect'

export type TableSelectProps<T> = BaseTableSelectProps<T>
const Comp = <T,>(props: TableSelectProps<T>) => {
  return (
    <TableSelect
      {...props}
      selectProps={{
        ...(props.selectProps || {}),
        bordered: false
      }}
    />
  )
}

export default Comp
