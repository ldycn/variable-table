import { message, Form } from 'antd'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  DataTypeEnum,
  DEFAULT_VALUES,
  ERROR_MESSAGES,
  INT_MIN,
  INT_MAX,
} from './configs'
import { FormTableRef } from '@/ux/form/table'

const FIELD_LIST_NAME = 'rows'
const ROW_KEY = 'key'

export const usePage = (formTableRef: React.RefObject<FormTableRef | null>) => {
  const [form] = Form.useForm()
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([])
  const keyCounterRef = useRef(0)
  const nameBeforeEditRef = useRef(new Map<number, string>())
  const dvBeforeEditRef = useRef(new Map<number, string>())

  useEffect(() => {
    form.setFieldValue(FIELD_LIST_NAME, [])
  }, [form])

  const handleAddRow = useCallback(() => {
    formTableRef.current?.add({ [ROW_KEY]: keyCounterRef.current })
    keyCounterRef.current += 1
  }, [formTableRef])

  const handleDeleteRow = useCallback(() => {
    if (selectedRowKeys.length === 0) {
      message.warning(ERROR_MESSAGES.noRowSelected)
      return
    }

    const rows: any[] = form.getFieldValue(FIELD_LIST_NAME) || []
    const indices = selectedRowKeys
      .map(key => rows.findIndex(row => row?.[ROW_KEY] === key))
      .filter(i => i >= 0)
      .sort((a, b) => b - a)

    indices.forEach(index => {
      formTableRef.current?.remove(index)
    })
    setSelectedRowKeys([])
  }, [form, formTableRef, selectedRowKeys])

  const handleDataTypeChange = useCallback((rowIndex: number, newType: DataTypeEnum) => {
    form.setFieldValue([FIELD_LIST_NAME, rowIndex, 'dataType'], newType)
    form.setFieldValue([FIELD_LIST_NAME, rowIndex, 'defaultValue'], DEFAULT_VALUES[newType])
  }, [form])

  const handleNameFocus = useCallback((rowIndex: number) => {
    const val = form.getFieldValue([FIELD_LIST_NAME, rowIndex, 'name']) || ''
    nameBeforeEditRef.current.set(rowIndex, val)
  }, [form])

  const doNameValidation = useCallback((rowIndex: number) => {
    const currentName = form.getFieldValue([FIELD_LIST_NAME, rowIndex, 'name']) || ''
    const prevName = nameBeforeEditRef.current.get(rowIndex) || ''

    if (!currentName.trim()) {
      message.error(ERROR_MESSAGES.nameEmpty)
      form.setFieldValue([FIELD_LIST_NAME, rowIndex, 'name'], prevName)
      return
    }

    const rows: any[] = form.getFieldValue(FIELD_LIST_NAME) || []
    const duplicate = rows.some(
      (row, i) =>
        i !== rowIndex &&
        (row?.name || '').toLowerCase() === currentName.trim().toLowerCase()
    )
    if (duplicate) {
      message.error(ERROR_MESSAGES.nameDuplicate)
      form.setFieldValue([FIELD_LIST_NAME, rowIndex, 'name'], prevName)
    }
  }, [form])

  const handleDefaultValueFocus = useCallback((rowIndex: number) => {
    const val = form.getFieldValue([FIELD_LIST_NAME, rowIndex, 'defaultValue']) || ''
    dvBeforeEditRef.current.set(rowIndex, val)
  }, [form])

  const doDefaultValueValidation = useCallback((rowIndex: number) => {
    const dataType = form.getFieldValue([FIELD_LIST_NAME, rowIndex, 'dataType'])
    if (!dataType) return

    const value = form.getFieldValue([FIELD_LIST_NAME, rowIndex, 'defaultValue']) || ''
    const prev = dvBeforeEditRef.current.get(rowIndex) || ''

    if (dataType === DataTypeEnum.BOOL) {
      const upper = value.toUpperCase()
      if (upper !== 'TRUE' && upper !== 'FALSE') {
        message.error(ERROR_MESSAGES.boolInvalid)
        form.setFieldValue([FIELD_LIST_NAME, rowIndex, 'defaultValue'], prev || DEFAULT_VALUES[DataTypeEnum.BOOL])
        return
      }
      form.setFieldValue([FIELD_LIST_NAME, rowIndex, 'defaultValue'], upper)
      return
    }

    if (dataType === DataTypeEnum.INT) {
      const trimmed = value.trim()
      if (!/^-?\d+$/.test(trimmed)) {
        message.error(ERROR_MESSAGES.intInvalid)
        form.setFieldValue([FIELD_LIST_NAME, rowIndex, 'defaultValue'], prev || DEFAULT_VALUES[DataTypeEnum.INT])
        return
      }
      const num = Number(trimmed)
      if (num < INT_MIN || num > INT_MAX) {
        message.error(ERROR_MESSAGES.intOutOfRange)
        form.setFieldValue([FIELD_LIST_NAME, rowIndex, 'defaultValue'], prev || DEFAULT_VALUES[DataTypeEnum.INT])
        return
      }
      form.setFieldValue([FIELD_LIST_NAME, rowIndex, 'defaultValue'], String(num))
    }
  }, [form])

  const rowSelection = useMemo(() => ({
    selectedRowKeys,
    onChange: (keys: (string | number)[]) => setSelectedRowKeys(keys),
  }), [selectedRowKeys, setSelectedRowKeys])

  return {
    form,
    rowSelection,
    handleAddRow,
    handleDeleteRow,
    handleNameFocus,
    doNameValidation,
    handleDataTypeChange,
    handleDefaultValueFocus,
    doDefaultValueValidation,
  }
}
