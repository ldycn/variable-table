import IDGenerator from '@/utils/IDGenerator'
import { useSize } from 'ahooks'
import { Table as AntdTable, TableProps as AntdTableProps } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { isNil } from 'lodash'
import { forwardRef, ReactNode, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import generateStyleEl from './generateClass'
import ScrollableTh from './ScrollableTh'

export interface TableProps<T> extends AntdTableProps<T> {
  /** 占位用，表格外标签需满足能找到固定高度标签的条件，这是表格动态高度实现的前提*/
  _?: any
  /** 占位用，继承antd table属性*/
  __?: any
  /** 表头的高度，如果是只有文字则不需要输入，否则需要手动输入黑格的高度，这样才能够让表体自适应滚动。 */
  headerHeight?: number
  /** 总结栏高度,规则同表头,无特殊高度，不需要声明。 */
  summaryHeight?: number
  /** 总结栏内容,仅需列出Summary.Cell数组 */
  summeryItems?: ReactNode[]
  enHoverHighlight?: boolean
  /** 通过scrollXXWitdh的设置，可以设置拖动时列宽的最大和最小值，暂时只支持非滚动部分宽度设置，部分不设置的场景下使用。
   *
   * 非滚动全部设置宽度的情况下，调节宽度会变成调节比例，在列表行可选择的时候会把选择框拉大，暂不适用。
   *
   * 在滚动的情况下要考虑最后一列的宽度变化配置问题，暂未测试和使用。
   *
   * BUG：现阶段在总宽度小于表格宽度时，改变宽度大小会导致选择框的大小随之改变,需要用户手动调整其他表格项宽度直到宽度总和等于表格总宽度时选择宽宽度才会恢复正常。
   * 现阶段修复方案为在总宽度小于表格宽度时每当修改表格项宽度。动态计算其他表格项宽度，使宽度总和等于表格总宽度。
   */
  columns: (ColumnsType<T>[0] & { scrollMinWidth?: number; scrollMaxWidth?: number })[]
  setColumns?: any
  /** 自定义组件配置，会与默认的 components 合并 */
  customComponents?: AntdTableProps<T>['components']
}
const HeaderSize = {
  small: 39,
  middle: 47,
  larget: 55
}

const showTotal = total => {
  return (
    <div className='flex items-center'>
      <div className=''>共 {total} 条</div>
    </div>
  )
}

const Table = forwardRef(<T,>(props: TableProps<T>, outRef) => {
  const ref = useRef()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const size = useSize(wrapperRef)

  const rootClassName = useRef('a' + IDGenerator.createRandomStringId())
  let rowSelection
  if (props.rowSelection) {
    rowSelection = {
      ...props.rowSelection,
      preserveSelectedRowKeys: true
    }
  }

  useImperativeHandle(outRef, () => ref.current)
  const pagination = useMemo(() => {
    if (props.pagination === false) {
      return false
    }
    let pagination = {
      showTotal,
      showSizeChanger: true,
      pageSizeOptions: [10, 20, 50, 100]
    }

    if (typeof props.pagination === 'object') {
      return {
        ...pagination,
        ...props.pagination
      }
    }
    return pagination
  }, [props.pagination])

  useEffect(() => {
    if (!ref.current) {
      return
    }
    const styleEl = generateStyleEl(
      rootClassName.current,
      props.headerHeight || HeaderSize[props.size] || HeaderSize.small,
      props.summeryItems
        ? props.summaryHeight || HeaderSize[props.size] - 1 || HeaderSize.small - 1
        : 0,
      { enHoverHighlight: props.enHoverHighlight }
    )
    return () => {
      const rootEl = document.querySelector(`.${rootClassName.current}`)
      if (rootEl && styleEl) {
        rootEl.removeChild(styleEl)
      }
    }
  }, [props.dataSource, props.pagination, props.columns])

  const handleResize = index => (newWidth: number) =>
    requestAnimationFrame(() => {
      const newColumns = [...props.columns]
      newColumns[index].width = Math.max(50, newWidth)
      props.setColumns?.(newColumns)
    })

  // useEffect(() => {
  //   setColumns(
  //     oldColumns =>
  //       props.columns?.map(newColumn => ({
  //         ...newColumn,
  //         width:
  //           oldColumns?.find(oldColumn => oldColumn.dataIndex === newColumn.dataIndex)?.width ||
  //           newColumn.width
  //       })) || []
  //   )
  // }, [props.columns])
  const isMultiRowsHeader = props.columns.some(v => v.children)
  const mergedColumns = isMultiRowsHeader
    ? props.columns
    : props.columns.map((col, index) => ({
        ...col,
        onHeaderCell: (column: any) => ({
          columnInfo: col,
          width: Math.max(50, column.width),
          onResize: handleResize(index)
        })
      }))

  const dataSource = useMemo(() => {
    if (!props.pagination || !props.pagination.current) {
      return props.dataSource?.map((v, index) => ({ ...v, __serialNumber__: index + 1 }))
    }
    return props.dataSource?.map((v, index) => ({
      ...v,
      __serialNumber__:
        (props.pagination?.pageSize || 0) * (props.pagination?.current - 1) + index + 1
    }))
  }, [props.dataSource, props.pagination])

  const tempHeight = useRef(undefined)
  useEffect(() => {
    tempHeight.current = size?.height
  }, [size?.height])
  const scrollY = useMemo(() => {
    const height = typeof size?.height === undefined ? tempHeight.current : size?.height
    return (
      height -
      ((HeaderSize[props.size] || HeaderSize.small) + (props.pagination !== false ? 56 : 0))
    )
  }, [size?.height, props.pagination, props.size])

  useEffect(() => {
    if (props.loading) {
      return
    }
    try {
      const input = document.querySelector(
        `.${rootClassName.current} .ant-pagination .ant-select-selection-search-input`
      )
      if (input) {
        input.disabled = true
      }
    } catch (e) {
      console.log(e)
    }
  }, [props.loading])

  useEffect(() => {
    if (!isNil(props.loading)) {
      return
    }
    try {
      const input = document.querySelector(
        `.${rootClassName.current} .ant-pagination .ant-select-selection-search-input`
      )
      if (input) {
        input.disabled = true
      }
    } catch (e) {
      console.log(e)
    }
  }, [props.loading, props.dataSource])
  const mergedComponents = useMemo(() => ({
    header: {
      cell: ScrollableTh
    },
    ...props.customComponents
  }), [props.customComponents])

  return (
    <div
      ref={wrapperRef}
      style={{
        height: '100%',
        minHeight: 0,
        overflow: 'hidden'
      }}
    >
      <AntdTable
        ref={ref}
        {...props}
        scroll={{ x: props.scroll?.x ?? 'max-content', y: props.scroll?.y || scrollY }}
        pagination={pagination}
        columns={mergedColumns}
        dataSource={dataSource}
        components={mergedComponents}
        rowSelection={rowSelection}
        className={rootClassName.current + ' ' + props.className}
        summary={
          props.summary ||
          (props.summeryItems
            ? () => {
                return (
                  <AntdTable.Summary fixed>
                    <AntdTable.Summary.Row className='!bg-[#D6E4FF]'>
                      {props.summeryItems}
                    </AntdTable.Summary.Row>
                  </AntdTable.Summary>
                )
              }
            : void 0)
        }
      />
    </div>
  )
})

export default Table
