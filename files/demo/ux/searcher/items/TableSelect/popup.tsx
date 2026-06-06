import { SearchBarProps } from '@/ux/layout/SearchBar'
import Table, { TableProps } from '@/ux/table/Table'
import { Form, message, SelectProps } from 'antd'
import { useForm } from 'antd/es/form/Form'
import FormItem from 'antd/es/form/FormItem'
import { RowSelectionType, TablePaginationConfig } from 'antd/es/table/interface'
import { debounce } from 'lodash'
import {
  cloneElement,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import './index.css'
import useKey from './useKey'
export interface PopupCommonProps<T, F> {
  getData: (
    params
  ) => Promise<
    { code: Exclude<number, 200>; msg: string } | { code: 200; data?: T[]; total?: number }
  >
  value?: T[] | undefined
  onChange?: (value: T[]) => void
  /** 参数里的rowKey不仅作为table的rowKey，也会作为select值的key，默认为id */
  rowKey: string
  init?: boolean
  dropDownSize?: [number, number]
}

export interface PopupProps<T, F> extends PopupCommonProps<T, F> {
  tableProps: Omit<TableProps<any>, 'loading' | 'dataSource' | 'rowKey'>
  searchItems?: SearchBarProps<F>['formItems']
  mode?: SelectProps['mode']
  open: boolean
  isInput: boolean
}
export type PopupRef = {
  refresh: () => void
  resetForm: () => void
  setOpen: (open: boolean) => void
  setLoading: (loading: boolean) => void
  setField: (key: string, value: any) => void
}
const Popup = forwardRef(<T, F>(props: PopupProps<T, F>, ref: React.ForwardedRef<PopupRef>) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const inputParams = useRef({})

  // 不用传参是因为popup会被缓存,传参不会生效。
  const [innerOpen, setInnerOpen] = useState(props.open)
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 5,
    total: 0,
    showSizeChanger: false
  })
  const formItemRefs = useRef([])
  const { focusedTableIndex, setFocusIndex } = useKey({
    formItemRefs,
    formCount: props.isInput
      ? Math.max(props.searchItems?.length - 1, 0)
      : props.searchItems?.length || 0,
    tableCount: data.length,
    data,
    open: innerOpen,
    onEnter(isTable, index) {
      if (isTable) {
        // 适配本地pagination的情况
        const newValue = data[(pagination.current - 1) * pagination.pageSize + index] || data[index]
        if (props.mode === 'multiple') {
          const exist = props.value?.find(v => v?.[props.rowKey] === newValue?.[props.rowKey])
          if (!exist) {
            props.onChange?.([...(props.value || []), newValue])
          } else {
            props.onChange?.(
              props.value.filter(v => v?.[props.rowKey] !== newValue?.[props.rowKey])
            )
          }
        } else {
          props.onChange?.([newValue])
        }
      }
    }
  })
  const rowSelection = {
    type: (props.mode === 'multiple' ? 'checkbox' : 'radio') as RowSelectionType,
    selectedRowKeys: props.value?.map(v => v?.[props.rowKey] || []),
    preserveSelectedRowKeys: true,
    onChange: (selectedRowKeys, selectedRows, info: { type }) => {
      const newValue = selectedRowKeys.map((rowKey, index) => {
        if (selectedRows[index]) {
          return selectedRows[index]
        }
        return props.value?.find(v => v?.[props.rowKey] === rowKey)
      })
      props.onChange?.(newValue)
    },
    ...(props.tableProps?.rowSelection || {})
  }
  const [form] = useForm()

  useImperativeHandle(ref, () => ({
    refresh: () => getData({ ...pagination, ...form.getFieldsValue() }),
    resetForm: () => form.resetFields(),
    setOpen: setInnerOpen,
    setLoading,
    setField: async (key, value) => {
      // form.setFieldValue(key, value)
      inputParams.current = { [key]: value }
      const newPagination = { current: 1, pageSize: 5 }
      setPagination(newPagination)
      getData({
        ...form.getFieldsValue(),
        ...newPagination,
        [key]: value
      })
    }
  }))
  const getData = async params => {
    setLoading(true)
    const res: any = await props.getData({ ...params, ...inputParams.current })
    setLoading(false)
    if (res.code === 200) {
      setData(res.data || res.rows || [])
    } else {
      message.error('获取数据失败！', res.msg)
      setData([])
    }
    if (props.tableProps.pagination !== false) {
      setPagination({
        current: params.current,
        pageSize: params.pageSize,
        total: res?.total || 0,
        showSizeChanger: false
      })
    }
  }
  const onParamsChange = useCallback(
    debounce(async values => {
      const newPagination = { current: 1, pageSize: 5 }
      return getData({ ...values, ...newPagination })
    }, 300),
    []
  )

  const onPaginationChange = async pagination => {
    return getData({ ...form.getFieldsValue(), ...pagination })
  }

  const formItems = useMemo(() => {
    return props.searchItems?.map((v, index) => ({
      key: v.key,
      comp: cloneElement(<>{v.comp}</>, { ref: v => (formItemRefs.current[index] = v) })
    }))
  }, [props.searchItems?.map(v => v.key)?.join(',')])
  useEffect(() => {
    if (props.init !== false && !props.isInput) {
      getData(pagination)
    }
  }, [])
  return (
    <div
      className='px-[8px] box-border flex flex-col justify-stretch'
      style={{
        width: props.dropDownSize?.[0] || 400,
        height: props.searchItems ? 240 : 200
      }}
    >
      {props.searchItems && !props.isInput && (
        <Form form={form} onValuesChange={onParamsChange} className='my-[8px] w-full'>
          {formItems.map(v => (
            <FormItem name={v.key} noStyle className='w-full'>
              <div className='w-full'>{v.comp}</div>
            </FormItem>
          ))}
        </Form>
      )}
      <div className='grow w-full'>
        <Table
          enHoverHighlight={false}
          className='w-full h-full __TableSelect__Table__'
          {...props.tableProps}
          loading={loading}
          pagination={
            props.tableProps.pagination === false
              ? false
              : { ...pagination, className: '!mb-[6px] !-mt-[6px]' }
          }
          rowClassName={(_, index) =>
            focusedTableIndex === index
              ? '__TableSelect__Selected_Table__Row__ '
              : '__TableSelect__unSelect_Table__Row__'
          }
          onRow={(record, index) => {
            return {
              onClick() {
                const newValue = data.find(v => record[props.rowKey] === v?.[props.rowKey])
                if (props.mode === 'multiple') {
                  const exist = props.value?.find(
                    v => v?.[props.rowKey] === newValue?.[props.rowKey]
                  )
                  if (!exist) {
                    props.onChange?.([...(props.value || []), newValue])
                  } else {
                    props.onChange?.(
                      props.value.filter(v => v?.[props.rowKey] !== newValue?.[props.rowKey])
                    )
                  }
                } else {
                  props.onChange?.([newValue])
                }
              },
              onMouseEnter: () => setFocusIndex(index)
              // onMouseLeave: () => setHoveredRowKey(null)
            }
          }}
          dataSource={data}
          rowKey={props.rowKey}
          onChange={onPaginationChange}
          rowSelection={rowSelection}
        />
      </div>
    </div>
  )
}) as <T, F>(props: PopupProps<T, F> & { ref: React.ForwardedRef<PopupRef> }) => React.ReactElement // TODO 可通过声明泛型Ref来解决reactRef本身不能传递泛型类型的bug

export default Popup
