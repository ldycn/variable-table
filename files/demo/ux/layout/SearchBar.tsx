import { SettingOutlined } from '@ant-design/icons'
import { Button, Form } from 'antd'
import { FormInstance, useForm } from 'antd/es/form/Form'
import FormItem from 'antd/es/form/FormItem'
import { ReactNode } from 'react'

export interface SearchBarProps<T> {
  formItems?: { key: string; label?: string; comp: ReactNode; breakBefore?: boolean; initialValue?: any }[]
  formInstance?: FormInstance
  /** 界面事件:
   *
   * onSearch：点击搜索的查询的事件
   *
   * onRowSetting：点击列配置按钮的事件
   */
  onSearch?: (value: T) => void
  onReset?: (form: FormInstance) => void
  onRowSetting?: () => void
  extraButtons?: ReactNode
}
const SearchBar = <T,> (props: SearchBarProps<T>) => {
  const [form] = useForm(props.formInstance)
  const onReset = () => {
    if (props.onReset) {
      props.onReset(form)
      return
    }
    form.resetFields()
  }
  const onSearch = () => {
    props.onSearch?.(form.getFieldsValue())
  }
  return (
    <div className='flex w-full items-start'>
      <Form form={form} className='flex flex-wrap flex-1 mb-[-8px]' onKeyDown={e => {
        if (e.key === 'Enter') {
          e.preventDefault()
          onSearch()
        }
      }}>
        {props.formItems.flatMap(v => {
          const items: ReactNode[] = []
          if (v.breakBefore) {
            items.push(<div key={`break-${v.key}`} style={{ flexBasis: '100%', height: 0 }} />)
          }
          items.push(
            <div key={v.key} className='mr-[16px] mb-[8px] flex items-center gap-2'>
              {v.label && <span className='text-gray-600 whitespace-nowrap'>{v.label}</span>}
              <FormItem name={v.key} initialValue={v.initialValue} noStyle>
                {v.comp}
              </FormItem>
            </div>
          )
          return items
        })}
      </Form>
      <div className='ml-[16px] flex-shrink-0 flex mb-[8px]'>
        {props.extraButtons && <>{props.extraButtons}</>}
        <Button
          onClick={onReset}
          type='text'
          className='mr-[10px] bg-[#F2F5FC] hover:!bg-[#D6E4FF]'
        >
          重置
        </Button>
        <Button onClick={onSearch} type='text' className=' bg-[#F2F5FC] hover:!bg-[#D6E4FF]'>
          查询
        </Button>
        {props.onRowSetting && (
          <Button
            className='bg-[#F2F5FC] hover:!bg-[#D6E4FF] ml-[10px]'
            type='text'
            icon={<SettingOutlined />}
            onClick={props.onRowSetting}
          />
        )}
      </div>
    </div>
  )
}

export default SearchBar
