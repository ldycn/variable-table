import { Select, SelectProps, TableProps } from 'antd'
import { omit } from 'lodash'
import { ReactNode, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import Popup, { PopupCommonProps, PopupRef } from './popup'

export interface TableSelectRef {
  focus: () => void
  isOpen: () => boolean
}

export interface TableSelectProps<T> extends PopupCommonProps<T> {
  /** TODO 第二层参数没哟解析PopupProps
   *
   * 占位用,由于antd select组件特性，多选模式下需要手动将最小宽度宽度定为可以显示出placeholder宽度的宽度以保证placeholder不被掩盖。 */
  _?: any
  /**  Select本身的props。不需要在其中声明'options' | 'value' | 'onChange' */
  selectProps?: Omit<SelectProps, 'options' | 'value' | 'onChange'>
  /** 和其他表带一样，用于生成placeholder和prefix */
  searchName: string
  mode?: 'multiple'
  /** 设置选择值在表单框中显示的方式。值类型为表格值类型。 */
  labelRender?: (value: T[]) => ReactNode
  /** 表格组件的参数。不需要指定'loading' | 'dataSource' */
  tableProps: Omit<TableProps, 'loading' | 'dataSource'>
  /**  value的值为table行数据*/
  value: T[]
  onChange: (newV: T[]) => void
}
const DEFAULT_ROWKEY = 'id'

const TableSelect = forwardRef(TableSelectInner) as <T>(
  props: TableSelectProps<T> & { ref?: React.Ref<TableSelectRef> }
) => React.ReactElement | null

function TableSelectInner<T>(props: TableSelectProps<T>, ref: React.Ref<TableSelectRef>) {
  const popupRef = useRef<PopupRef>()
  const selectRef = useRef<any>()
  const [open, setOpen] = useState(false)

  useImperativeHandle(ref, () => ({
    focus: () => {
      selectRef.current?.focus()
    },
    isOpen: () => open,
  }), [open])
  const openAnimating = useRef(false)
  const rowKey =
    props.rowKey ||
    ((typeof props.tableProps.rowKey === 'function'
      ? (props.tableProps.rowKey as any)() // 因为没有继承antd的table的rowKey属性类型，所以用any屏蔽
      : props.tableProps.rowKey) as any) ||
    DEFAULT_ROWKEY
  const isInput = props.searchMode === 'input'
  const onOpenChange = async newOpen => {
    if (openAnimating.current) {
      return
    }
    if (!newOpen && open === true) {
      setOpen(false)
    }
    // setTimeout(() => {
    //   if (!newOpen && open === true) {
    //     setOpen(false)
    //   }
    // }, 100)
    if (open && !isInput && props.init) {
      setTimeout(() => popupRef?.current?.refresh?.(), 0)
    }
  }
  const onChange = items => {
    if (props.mode !== 'multiple' && items.length === 1) {
      setOpen(false)
      selectRef.current?.blur()
    }
    props.onChange?.(items)
  }

  const onClear = () => {
    popupRef.current?.resetForm()
    props.onChange?.([])
  }

  const [searchValue, setSearchValue] = useState('')
  useEffect(() => {
    popupRef.current?.setOpen(open)
  }, [open])
  const handleKeyDown = async e => {
    if (e.key !== 'Enter') {
      return
    }
    if (!isInput) {
      if (!open) {
        setOpen(true)
      }
      return
    }
    if (open) {
      return
    }
    if (props.searchItems?.length !== 1) {
      console.error(' Input表单搜索框，表单项应该有且只有一个。')
      return
    }
    popupRef.current?.setLoading?.(true)
    const res: any = await props.getData({
      current: 1,
      pageSize: 2,
      [props.searchItems[0].key]: searchValue
    })
    if (res.data.length !== 1) {
      if (!open) {
        setOpen(true)
      }
      setTimeout(() => {
        popupRef.current?.setField(props.searchItems[0].key, searchValue)
      }, 500)
      return
    }
    onChange(res.data)
    setSearchValue(props.selectProps?.labelRender(res.data[0]))
  }

  useEffect(() => {
    openAnimating.current = true
    setTimeout(() => {
      openAnimating.current = false
    }, 500)
  }, [open])
  return (
    <Select
      onKeyDown={handleKeyDown}
      // onFocus={() => {setSearchValue('')}}
      ref={selectRef}
      searchValue={searchValue}
      popupMatchSelectWidth={false}
      onClick={e => {
        if (
          !isInput &&
          !openAnimating.current &&
          (e.target.className.includes('ant-select-selection-search-input') ||
            e.target.className.includes('ant-select-selection-item') ||
            e.target.className.includes('ant-select-selection-overflow'))
        ) {
          setOpen(v => !v)
        }
      }}
      dropdownStyle={{
        minWidth: props.dropDownSize[0],
        maxWidth: props.dropDownSize[1]
      }}
      showSearch={isInput}
      onSearch={v => {
        setSearchValue(v)
        setOpen(false)
      }}
      value={Array.isArray(props.value) ? props.value?.map(v => v?.[rowKey]) : []}
      allowClear
      maxTagTextLength={10}
      maxTagCount={1}
      onChange={(keys, values) => {
        const newValue = keys.map((key, index) => {
          if (values[index]?.[rowKey]) {
            return values[index]
          }
          return props.value?.find(v => v?.[rowKey] === key)
        })
        props.onChange?.(newValue)
      }}
      onDropdownVisibleChange={onOpenChange}
      {...(props.selectProps || {})}
      mode={isInput ? undefined : props.mode}
      placeholder={
        typeof props.selectProps?.placeholder === 'undefined'
          ? props.searchName
          : props.selectProps?.placeholder
      }
      onClear={onClear}
      labelRender={({ value }) => {
        const selectValue = props.value?.find(v => v?.[rowKey] === value)
        if (props.selectProps?.labelRender) {
          //  Label Render中如果返回的是react节点，需要把react节点添加pointer-events-none属性
          return props.selectProps?.labelRender(selectValue)
        }
        return selectValue?.name
      }}
      popupClassName={
        props.dropDownSize
          ? `!min-w-[${props.dropDownSize[0]}px] !max-w-[${props.dropDownSize[0]}px] `
          : undefined
      }
      open={open}
      onOpenChange={setOpen}
      dropdownRender={() => (
        <Popup<T>
          key={open ? 'open' : 'close'}
          ref={popupRef}
          mode={props.selectProps?.mode}
          {...omit(props, ['selectProps', 'labelRender', 'rowKey'])}
          onChange={onChange}
          value={props.value}
          rowKey={rowKey}
          isInput={isInput}
        />
      )}
    />
  )
}

export default TableSelect
