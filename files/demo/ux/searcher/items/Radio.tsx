import { Radio as AntdRadio, RadioGroupProps } from 'antd'
import { omit } from 'lodash'

export interface RadioProps extends RadioGroupProps {
  /** 占位用,该组件继承antdRadioProps除了placeholder的部分。 */
  _?: any
  searchName?: string
}
const Radio = (props: RadioProps) => {
  return (
    <div className='w-fit flex justify-center'>
      {props.searchName}
      {props.searchName ? '：' : ''}
      <div className='mt-[-2px]'>
        <AntdRadio.Group {...omit(props, ['searchName'])} />
      </div>
    </div>
  )
}

export default Radio
