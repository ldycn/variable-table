import { SearchOutlined } from '@ant-design/icons'
import {
  Input as AntdInput,
  InputProps as AntdInputPorps,
  type InputRef as AntdInputRef
} from 'antd'
import { forwardRef, useImperativeHandle, useRef } from 'react'

export interface InputProps extends Omit<AntdInputPorps, 'placeholder'> {
  /** 占位用,该组件继承antdInputProps除了placeholder的部分。 */
  _?: any
  /** 表单宽度，需要指定，宽度需要能尽量付改大多数情况的输入长度，并使placeholder能完整展示。不输入的话默认100 */
  width?: number
  /** 搜索范围名称列表，将作为placeholder展示。为空的话会显示搜索二字。 */
  searchNames?: string[]
}

interface ExposedInputRef {
  formElement: HTMLInputElement | undefined
}

const Input = forwardRef<ExposedInputRef, InputProps>((props: InputProps, ref) => {
  // 暴露自定义方法给父组件
  const inputRef = useRef<AntdInputRef>(null)
  useImperativeHandle(ref, () => ({
    get formElement() {
      return inputRef.current?.input
    }
  }))
  // 合并样式，如果传入的 style 中有 width，优先使用传入的；否则使用 props.width 或默认值
  const mergedStyle = {
    ...props.style,
    width: props.style?.width || props.width || 100
  }

  return (
    <AntdInput
      {...props}
      ref={inputRef}
      allowClear
      prefix={<SearchOutlined />}
      placeholder={props.searchNames?.join('/') || '搜索'}
      style={mergedStyle}
    />
  )
})

export default Input
