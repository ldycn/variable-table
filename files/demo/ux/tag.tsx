import { omit } from 'lodash'

export interface TagProps extends React.ComponentProps<'div'> {
  /** 分区详情/表单组件 */
  color: 'green' | 'blue' | 'gray' | 'orange' | 'red'
}

const colorStyle = {
  green: {
    border: '1px solid #52C41A',
    color: '#52C41A'
  },
  blue: {
    border: '1px solid #0052D9',
    color: '#0052D9'
  },
  gray: {
    border: '1px solid #8c8c8c',
    color: '#8c8c8c'
  },
  red: {
    border: '1px solid #f56c6c',
    color: '#f56c6c'
  },
  orange: {
    border: '1px solid #e6a23c',
    color: '#e6a23c'
  }
}
const Tag = (props: TagProps) => {
  return (
    <div
      {...omit(props, ['color'])}
      className={
        'w-fit p-[12px] h-[24px] flex items-center justify-center box-border rounded-[12px] ' +
        props.className
      }
      style={{
        ...(colorStyle[props.color] || {}),
        ...(props.style || {})
      }}
    />
  )
}

export default Tag
