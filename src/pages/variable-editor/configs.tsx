import Input from '@/ux/form/table/items/input'
import Select from '@/ux/form/table/items/Select'
import { getSerialNumberColumnConfig } from '@/ux/table/columnItems'

export enum DataTypeEnum {
  BOOL = 'BOOL',
  INT = 'INT'
}

export const DATA_TYPE_OPTIONS = [
  { value: DataTypeEnum.BOOL, label: 'BOOL', labelInValue: 'BOOL' },
  { value: DataTypeEnum.INT, label: 'INT', labelInValue: 'INT' }
]

export const DEFAULT_VALUES: Record<DataTypeEnum, string> = {
  [DataTypeEnum.BOOL]: 'TRUE',
  [DataTypeEnum.INT]: '0'
}

export const INT_MIN = -2147483648
export const INT_MAX = 2147483647

export const COLUMN_TITLES = {
  name: 'Name',
  dataType: 'Data Type',
  defaultValue: 'Default Value',
  comment: 'Comment'
} as const

export const BUTTON_TEXT = {
  addRow: 'Add Row',
  deleteRow: 'Delete Row'
} as const

export const ERROR_MESSAGES = {
  nameEmpty: 'Name cannot be empty!',
  nameDuplicate: 'Name already exists!',
  boolInvalid: 'BOOL default value must be TRUE or FALSE!',
  intInvalid: 'INT default value must be an integer!',
  intOutOfRange: 'INT default value out of range!',
  noRowSelected: 'Please select a row to delete!'
} as const

export interface ColumnHandlers {
  form: any
  handleNameFocus: (index: number) => void
  doNameValidation: (index: number) => void
  handleDataTypeChange: (index: number, value: DataTypeEnum) => void
  handleDefaultValueFocus: (index: number) => void
  doDefaultValueValidation: (index: number) => void
}

export const getColumnConfigs = (handlers: ColumnHandlers): any[] => [
  getSerialNumberColumnConfig(),
  {
    title: COLUMN_TITLES.name,
    dataIndex: 'name',
    key: 'name',
    width: 200,
    render: (value: any, record: any, index: number, formItemProps: any) => (
      <Input
        formItemProps={{ ...formItemProps, noStyle: true }}
        onFocus={() => handlers.handleNameFocus(index)}
        onBlur={() => handlers.doNameValidation(index)}
        onPressEnter={() => handlers.doNameValidation(index)}
      />
    )
  },
  {
    title: COLUMN_TITLES.dataType,
    dataIndex: 'dataType',
    key: 'dataType',
    width: 150,
    render: (value: any, record: any, index: number, formItemProps: any) => (
      <Select
        onChange={(val: DataTypeEnum) => handlers.handleDataTypeChange(index, val)}
        options={DATA_TYPE_OPTIONS as any}
        formItemProps={{ ...formItemProps, noStyle: true }}
        allowClear={false}
        style={{ width: '100%' }}
      />
    )
  },
  {
    title: COLUMN_TITLES.defaultValue,
    dataIndex: 'defaultValue',
    key: 'defaultValue',
    width: 200,
    render: (value: any, record: any, index: number, formItemProps: any) => (
      <Input
        formItemProps={{ ...formItemProps, noStyle: true }}
        onFocus={() => handlers.handleDefaultValueFocus(index)}
        onBlur={() => handlers.doDefaultValueValidation(index)}
        onPressEnter={() => handlers.doDefaultValueValidation(index)}
      />
    )
  },
  {
    title: COLUMN_TITLES.comment,
    dataIndex: 'comment',
    key: 'comment',
    width: 250,
    render: (value: any, record: any, index: number, formItemProps: any) => (
      <Input formItemProps={{ ...formItemProps, noStyle: true }} />
    )
  }
]
