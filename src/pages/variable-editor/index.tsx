import Form from '@/ux/form/Form'
import FormTable, { FormTableRef } from '@/ux/form/table'
import { Button, Space } from 'antd'
import React, { useMemo, useRef } from 'react'
import { BUTTON_TEXT, getColumnConfigs } from './configs'
import { usePage } from './usePage'

const VariableEditorPage: React.FC = () => {
  const formTableRef = useRef<FormTableRef>(null)
  const {
    form,
    rowSelection,
    handleAddRow,
    handleDeleteRow,
    handleNameFocus,
    doNameValidation,
    handleDataTypeChange,
    handleDefaultValueFocus,
    doDefaultValueValidation
  } = usePage(formTableRef)

  const columns = useMemo(
    () =>
      getColumnConfigs({
        form,
        handleNameFocus,
        doNameValidation,
        handleDataTypeChange,
        handleDefaultValueFocus,
        doDefaultValueValidation
      }),
    [form, handleNameFocus, doNameValidation, handleDataTypeChange, handleDefaultValueFocus, doDefaultValueValidation]
  )

  return (
    <div className='h-full flex flex-col p-4'>
      <div className='mb-4'>
        <Space>
          <Button type='primary' onClick={handleAddRow} data-testid='add-row-btn'>
            {BUTTON_TEXT.addRow}
          </Button>
          <Button danger onClick={handleDeleteRow} data-testid='delete-row-btn'>
            {BUTTON_TEXT.deleteRow}
          </Button>
        </Space>
      </div>
      <div className='flex-1 min-h-0'>
        <Form component={false} form={form}>
          <FormTable ref={formTableRef} name='rows' columns={columns} rowKey='key' rowSelection={rowSelection} />
        </Form>
      </div>
    </div>
  )
}

export default VariableEditorPage
