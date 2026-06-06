import { Input as AntdInput, Spin } from 'antd'
import FormItem, { FormItemProps } from 'antd/es/form/FormItem'
import { TextAreaProps as AntdTextAreaProps } from 'antd/es/input'
import { omit } from 'lodash'

export interface TextAreaProps extends Omit<AntdTextAreaProps, 'placeholder'> {
  /** 占位用,该组件继承antdInputProps除了placeholder的部分。 */
  _?: any
  /** formItem的Props */
  formItemProps?: FormItemProps
  placeholder?: string
  /** 加载状态 */
  loading?: boolean
  /** 文本域行数 */
  rows?: number
}

const TextArea = (props: TextAreaProps) => {
  const maxLength = props.maxLength || 200
  let rules = props.formItemProps?.rules || []

  // 添加必填规则
  if (props.formItemProps?.required) {
    rules = rules.filter((v: any) => v.required !== true)
    rules.push({ required: true, message: '请输入' + props.formItemProps?.label + '！' })
  }

  // 添加长度规则
  rules.push({ max: maxLength, message: '输入内容超长！' })

  // 创建TextArea元素
  const textAreaElement = (
    <AntdInput.TextArea
      {...omit(props, 'required', 'formItemProps', 'loading')}
      allowClear
      onKeyDown={e => {
        if (e.key === 'Enter') {
          e.preventDefault()
        }
      }}
      maxLength={maxLength}
      showCount
      placeholder={props.placeholder || '请填写'}
      rows={props.rows || 4} // 默认行数
      className={'w-full ' + props.className}
    />
  )

  return (
    <FormItem
      {...props.formItemProps}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      rules={rules}
      shouldUpdate
    >
      {props.loading ? <Spin>{textAreaElement}</Spin> : textAreaElement}
    </FormItem>
  )
}

export default TextArea
