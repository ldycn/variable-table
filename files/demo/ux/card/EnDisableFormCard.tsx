import { Card as AntdCard, CardProps as AntdCardProps, Switch } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { omit } from 'lodash'

export interface EnDisableFormCardProps extends AntdCardProps {
  /** 实体名称，生成标题使用 */
  title: string
  action: string
  fieldName: string
  disabled?: boolean
}
const EnDisableFormCard = (props: EnDisableFormCardProps) => {
  return (
    <AntdCard
      className='w-full'
      bodyStyle={{
        padding: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      {...omit(props, ['children', 'title'])}
    >
      <div className='w-full box-border px-[16px] py-[14px] border-b-[1px] boder-b-[#EEEEEE] flex justify-between items-center bg-[#F3F3F4] '>
        <div className='text-[14px] font-bold'>{props.title}</div>
        <div className='shrink-0 flex items-center'>
          {props.action}
          <FormItem name={props.fieldName} noStyle>
            <Switch
              checkedChildren='已启用'
              className='ml-[12px]'
              unCheckedChildren='未启用'
              disabled={props.disabled}
            />
          </FormItem>
        </div>
      </div>
      {props.children}
    </AntdCard>
  )
}

export default EnDisableFormCard
