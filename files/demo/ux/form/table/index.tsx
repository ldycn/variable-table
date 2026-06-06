import { FieldCell, FieldRegistryContext, useFieldRegistryProvider } from '@/ux/form/field'
import Table, { TableProps } from '@/ux/table/Table'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import type { DragEndEvent } from '@dnd-kit/core'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TableProps as AntdTableProps, Button, Form, FormItemProps, Space } from 'antd'
import useFormInstance from 'antd/es/form/hooks/useFormInstance'
import { keyBy, omit, values } from 'lodash'
import React, { useContext, useMemo, useRef, useState } from 'react'

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
  draggable?: boolean
  onDragEnd?: (newData: any[]) => void
}

const Label = props => {
  const dataIndexIsList = Array.isArray(props.dataIndex)
  let data = props.value
  if (dataIndexIsList) {
    data = props.dataIndex.slice(1).reduce((temp, v) => {
      return temp?.[v]
    }, props.value)
  }
  return <div>{data}</div>
}

const ActionCell = props => {
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

const recoverScrollTop = (scrllEl, scrollTop, delayFrame = 60, last = 1) => {
  requestAnimationFrame(() => {
    if (scrllEl) {
      scrllEl.scrollTop = scrollTop
    }
  })
}
const FormItemComp = props => {
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

function upsertListById(list, items, key) {
  return values({
    ...keyBy(list, key),
    ...keyBy(items, key)
  })
}

interface DragRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string
}

const DragRow: React.FC<Readonly<DragRowProps>> = props => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key']
  })

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: 'move',
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {})
  }

  return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />
}

const FormTable = <T,>(props: Props<T>) => {
  const tableRef = useRef()
  const form = Form.useFormInstance()
  const data = useRef([])
  const [dragVersion, setDragVersion] = useState(0)
  const existingRegistry = useContext(FieldRegistryContext)
  const ownRegistry = useFieldRegistryProvider(`formtable-${props.name}`)
  const registry = existingRegistry || ownRegistry

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1
      }
    })
  )

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const currentData = form.getFieldValue(props.name) || []
      const activeIndex = parseInt(active.id as string, 10)
      const overIndex = parseInt(over?.id as string, 10)
      const newData = arrayMove(currentData, activeIndex, overIndex)
      form.setFieldValue(props.name, newData)
      setDragVersion(v => v + 1)
      props.onDragEnd?.(newData)
    }
  }

  const columns = useMemo<AntdTableProps['columns']>(() => {
    const firstColumn = {
      width: 80,
      dataIndex: 'btn',
      title: '操作',
      key: 'btn',
      fixed: 'left',
      render: (value, record, index) => {
        return (
          <ActionCell
            name={props.name}
            index={index}
            _field={record._field}
            _fields={record._fields}
            _operation={record._operation}
            showAddButton={props.showAddButton}
            showDeleteButton={props.showDeleteButton}
            onDeleteLine={(...args) => {
              const el = tableRef.current?.nativeElement
              const scrllEl = el?.querySelector('.ant-table-body')
              const scrollTop = scrllEl?.scrollTop
              recoverScrollTop(scrllEl, scrollTop)
              return props.onDeleteLine?.(...args)
            }}
            onAddLine={(...args) => {
              const el = tableRef.current?.nativeElement
              const scrllEl = el?.querySelector('.ant-table-body')
              const scrollTop = scrllEl?.scrollTop
              recoverScrollTop(scrllEl, scrollTop)
              return props?.onAddLine?.(...args)
            }}
          />
        )
      }
    }
    const otherColumn = props.columns.map((v, colIndex) => {
      if (!v.render) {
        const dataIndexIsList = Array.isArray(v.dataIndex)
        return {
          ...v,
          render(_, record) {
            return (
              <Form.Item
                name={[record._field.name, dataIndexIsList ? v.dataIndex[0] : v.dataIndex]}
                noStyle
                shouldUpdate
              >
                <Label dataIndex={v.dataIndex} />
              </Form.Item>
            )
          }
        }
      }
      return {
        ...v,
        render(...args) {
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
          const table = (
            <Table
              ref={tableRef}
              size='small'
              columns={columns}
              className='custom-small-table'
              {...omit(props, [
                'columns',
                'name',
                'rowSelection',
                'draggable',
                'onDragEnd',
                'rowKey'
              ])}
              rowKey={(props.draggable ? '_dragKey' : props.rowKey) as string}
              customComponents={{
                ...(props.draggable && { body: { row: DragRow } })
              }}
              dataSource={fields.map((field, index) => ({
                _field: field,
                _fields: fields,
                _operation: operation,
                _dragKey: `${index}-${dragVersion}`,
                [props.rowKey || 'id']: form.getFieldValue(props.name)?.[index]?.[
                  props.rowKey || 'id'
                ],
                data: form.getFieldValue(props.name)?.[index]
              }))}
              rowSelection={
                props.rowSelection && {
                  ...(props.rowSelection || {}),
                  onChange(keys, values, type) {
                    const el = tableRef.current.nativeElement
                    const scrllEl = el.querySelector('.ant-table-body')
                    const scrollTop = scrllEl.scrollTop
                    recoverScrollTop(scrllEl, scrollTop)
                    props.rowSelection?.onChange?.(
                      keys,
                      values.map(v =>
                        data.current?.find(v1 => v?.data?.[props.rowKey] === v1?.[props.rowKey])
                      ),
                      type
                    )
                  }
                }
              }
              pagination={false}
            />
          )

          if (props.draggable) {
            return (
              <DndContext
                sensors={sensors}
                modifiers={[restrictToVerticalAxis]}
                onDragEnd={onDragEnd}
              >
                <SortableContext
                  items={fields.map((_, index) => `${index}-${dragVersion}`)}
                  strategy={verticalListSortingStrategy}
                >
                  {table}
                </SortableContext>
              </DndContext>
            )
          }

          return table
        }}
      </Form.List>
    </FieldRegistryContext.Provider>
  )
}

export default FormTable
