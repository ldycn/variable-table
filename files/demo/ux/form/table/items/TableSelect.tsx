import { useFieldRegistration } from '@/ux/form/field'
import BaseTableSelect, { TableSelectProps, TableSelectRef } from '@/ux/searcher/items/TableSelect/TableSelect'
import FormItem, { FormItemProps } from 'antd/es/form/FormItem'
import { omit } from 'lodash'
import React, { useCallback, useRef } from 'react'

export interface TableSelectFormItemProps<T> extends Omit<TableSelectProps<T>, 'placeholder'> {
  _?: any
  formItemProps?: FormItemProps
}

const TableSelectFormItem = <T,>(props: TableSelectFormItemProps<T>) => {
  const selectRef = useRef<TableSelectRef>(null)

  const focus = useCallback(() => {
    selectRef.current?.focus()
  }, [])

  const shouldNavigate = useCallback(
    () => !selectRef.current?.isOpen(),
    []
  )

  useFieldRegistration({ type: 'tableSelect', focus, shouldNavigate })

  let rules = props.formItemProps?.rules || []
  if (props.formItemProps?.required) {
    rules = rules.filter((v: any) => v.required !== true)
    rules.push({ required: true, message: '请选择' + props.formItemProps?.label + '！' })
  }

  return (
    <FormItem {...props.formItemProps} rules={rules} shouldUpdate label={undefined}>
      <BaseTableSelect<T>
        ref={selectRef}
        {...omit(props, ['formItemProps'])}
      />
    </FormItem>
  )
}

export default TableSelectFormItem
