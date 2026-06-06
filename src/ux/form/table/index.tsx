import { FieldCell, FieldRegistryContext, useFieldRegistryProvider } from '@/ux/form/field'
import Table, { TableProps } from '@/ux/table/Table'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { TableProps as AntdTableProps, Button, Form, FormItemProps, Space } from 'antd'
import useFormInstance from 'antd/es/form/hooks/useFormInstance'
import { keyBy, omit, values } from 'lodash'
import React, { useContext, useImperativeHandle, useMemo, useRef } from 'react'

type Props<T> = Omit<TableProps<T>, 'columns'> & {
  name: string
  showLineEditor?: boolean
  showAddButton?: ((value: any, record: any, index: number) => boolean) | boolean
  showDeleteButton?: ((value: any, record: any, index: number) => boolean) | boolean
  onAddLine?: (value: any, record: any, index: number) => boolean | void | Promise<boolean | void>
  onDeleteLine?: (
    value: any,
    record: any,
    index: number,
    isOnlyLine: boolean
  ) => boolean | void | Promise<boolean | void>
  columns: Array<
    AntdTableProps['columns'][0] & {
      form?: boolean
      formItemProps?: Partial<FormItemProps>
    }
  >
  rowKey?: string
}

const Label = (props: { value: any; dataIndex: string | string[] }) => {
  const dataIndexIsList = Array.isArray(props.dataIndex)
  let data = props.value
  if (dataIndexIsList) {
    data = (props.dataIndex as string[]).slice(1).reduce((temp: any, v) => {
      return temp?.[v]
    }, props.value)
  }
  return <div>{data}</div>
}

const ActionCell = (props: any) => {
  const form = useFormInstance()
  const rowValue = Form.useWatch([props.name, props._field.name], form)
  const record = {
    ...rowValue,
    _field: props._field,
    _operation: props._operation,
    _form: form
  }
  const value = record?.[props.dataIndex]
  const isOnlyLine = props._fields?.length === 1
  const showAdd =
    typeof props.showAddButton === 'function'
      ? props.showAddButton?.(value, record, props.index)
      : (props.showAddButton ?? props._fields?.length === props.index + 1)
  const showDelete =
    typeof props.showDeleteButton === 'function'
      ? props.showDeleteButton?.(value, record, props.index)
      : (props.showDeleteButton ?? true)

  return (
    <Space className='flex justify-end'>
      {showAdd && (
        <Button
          className='!bg-blue-500 !text-white !hover:bg-blue-500 !focus:bg-blue-500 !active:bg-blue-500 !border-none rounded-[30px]'
          icon={<PlusOutlined />}
          size='small'
          onClick={async () => {
            const doNext = await props.onAddLine?.(value, record, props.index)
            if (doNext !== false) {
              record._operation.add({})
            }
          }}
        />
      )}
      {showDelete && (
        <Button
          className='!bg-red-500 !text-white !hover:bg-red-500 !focus:bg-red-500 !active:bg-red-500 !border-none rounded-[30px]'
          icon={<MinusOutlined />}
          size='small'
          onClick={async () => {
            const doDelete = () => {
              if (isOnlyLine) {
                form.setFieldValue(props.name, [{}])
              } else {
                record._operation.remove(props.index)
              }
            }
            const doNext = await props.onDeleteLine?.(value, record, props.index, isOnlyLine)
            if (doNext !== false) {
              doDelete()
            }
          }}
        />
      )}
    </Space>
  )
}

const recoverScrollTop = (scrllEl: Element | null | undefined, scrollTop: number) => {
  requestAnimationFrame(() => {
    if (scrllEl) {
      scrllEl.scrollTop = scrollTop
    }
  })
}

const FormItemComp = (props: any) => {
  const form = useFormInstance()
  const rowValue = Form.useWatch([props.name, props._field.name], form)
  const record = {
    ...rowValue,
    _field: props._field,
    _operation: props._operation,
    __serialNumber__: props.__serialNumber__,
    _form: form
  }
  const value = record?.[props.dataIndex]
  const formItemProps = useMemo(
    () => ({
      name: [props._field.name, props.dataIndex]
    }),
    [props._field.name, props.dataIndex]
  )

  return (
    <FieldCell
      coord={{ row: props.index, col: props.colIndex }}
      fieldName={[props._field.name, props.dataIndex]}
    >
      {props.render(value, record, props.index, formItemProps)}
    </FieldCell>
  )
}

function upsertListById(list: any[], items: any[], key?: string) {
  return values({
    ...keyBy(list, key),
    ...keyBy(items, key)
  })
}

export type FormTableRef = {
  add: (defaultValue?: any, insertIndex?: number) => void
  remove: (index: number) => void
}

const FormTable = React.forwardRef<FormTableRef, any>((props: Props<any>, ref) => {
  const tableRef = useRef<any>()
  const form = Form.useFormInstance()
  const data = useRef<any[]>([])
  const operationRef = useRef<any>(undefined)
  const existingRegistry = useContext(FieldRegistryContext)
  const ownRegistry = useFieldRegistryProvider(`formtable-${props.name}`)
  const registry = existingRegistry || ownRegistry

  useImperativeHandle(ref, () => ({
    add: (...args: any[]) => operationRef.current?.add(...args),
    remove: (...args: any[]) => operationRef.current?.remove(...args),
  }))

  const columns = useMemo<AntdTableProps['columns']>(() => {
    const firstColumn: any = {
      width: 80,
      dataIndex: 'btn',
      title: '操作',
      key: 'btn',
      fixed: 'left',
      render: (value: any, record: any, index: number) => (
        <ActionCell
          name={props.name}
          index={index}
          _field={record._field}
          _fields={record._fields}
          _operation={record._operation}
          showAddButton={props.showAddButton}
          showDeleteButton={props.showDeleteButton}
          onDeleteLine={(...args: any[]) => {
            const el = tableRef.current?.nativeElement
            const scrllEl = el?.querySelector('.ant-table-body')
            const scrollTop = scrllEl?.scrollTop
            recoverScrollTop(scrllEl, scrollTop)
            return props.onDeleteLine?.(args[0], args[1], args[2], args[3])
          }}
          onAddLine={(...args: any[]) => {
            const el = tableRef.current?.nativeElement
            const scrllEl = el?.querySelector('.ant-table-body')
            const scrollTop = scrllEl?.scrollTop
            recoverScrollTop(scrllEl, scrollTop)
            return props?.onAddLine?.(args[0], args[1], args[2])
          }}
        />
      )
    }
    const otherColumn: any = (props.columns as any[]).map((v: any, colIndex: number) => {
      if (!v.render) {
        const dataIndexIsList = Array.isArray(v.dataIndex)
        return {
          ...v,
          render(_: any, record: any) {
            return (
              <Form.Item
                name={[record._field.name, dataIndexIsList ? v.dataIndex[0] : v.dataIndex]}
                noStyle
                shouldUpdate
              >
                <Label value={_} dataIndex={v.dataIndex} />
              </Form.Item>
            )
          }
        }
      }
      return {
        ...v,
        render(...args: any[]) {
          const [_, record, index] = args
          return (
            <FormItemComp
              name={props.name}
              index={index}
              colIndex={colIndex}
              dataIndex={v.dataIndex}
              render={v.render}
              _field={record._field}
              _operation={record._operation}
              __serialNumber__={record.__serialNumber__}
            />
          )
        }
      }
    })
    if (props.showLineEditor) {
      return [firstColumn, ...otherColumn]
    }
    return otherColumn
  }, [
    props.columns,
    props.onAddLine,
    props.onDeleteLine,
    props.showAddButton,
    props.showDeleteButton
  ])

  return (
    <FieldRegistryContext.Provider value={registry}>
      <Form.Item hidden noStyle shouldUpdate={true}>
        {() => {
          data.current = upsertListById(
            data.current,
            form.getFieldValue(props.name) || [],
            props.rowKey
          )
          return null
        }}
      </Form.Item>
      <Form.List name={props.name}>
        {(fields, operation) => {
          operationRef.current = operation
          const restProps = omit(props, [
            'columns',
            'name',
            'rowSelection',
            'rowKey',
            'showLineEditor',
            'showAddButton',
            'showDeleteButton',
            'onAddLine',
            'onDeleteLine'
          ])
          return (
            <Table
              ref={tableRef}
              size='small'
              columns={columns}
              className='custom-small-table'
              {...(restProps as any)}
              rowKey={props.rowKey || 'id'}
              dataSource={fields.map((field, index) => ({
                _field: field,
                _fields: fields,
                _operation: operation,
                [props.rowKey || 'id']: form.getFieldValue(props.name)?.[index]?.[
                  props.rowKey || 'id'
                ],
                data: form.getFieldValue(props.name)?.[index]
              }))}
              rowSelection={
                props.rowSelection
                  ? {
                      ...(props.rowSelection as any),
                      onChange(keys: any, vals: any, type: any) {
                        const el = tableRef.current?.nativeElement
                        if (el) {
                          const scrllEl = el.querySelector('.ant-table-body')
                          if (scrllEl) {
                            recoverScrollTop(scrllEl, scrllEl.scrollTop)
                          }
                        }
                        ;(props.rowSelection as any)?.onChange?.(
                          keys,
                          vals.map((v: any) =>
                            data.current?.find((v1: any) => v?.data?.[props.rowKey] === v1?.[props.rowKey])
                          ),
                          type
                        )
                      }
                    }
                  : undefined
              }
              pagination={false}
            />
          )
        }}
      </Form.List>
    </FieldRegistryContext.Provider>
  )
})

FormTable.displayName = 'FormTable'

export default FormTable
