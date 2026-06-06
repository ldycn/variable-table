import { Switch as AntdSwitch, SwitchProps as AntdSwitchPorps } from 'antd'
import { omit } from 'lodash'

export interface SwitchProps extends AntdSwitchPorps {
  /** 占位用,该组件继承antdSwitchProps除了placeholder的部分。 */
  _?: any
  /** 表单宽度，需要指定，宽度需要能尽量付改大多数情况的输入长度，并使placeholder能完整展示。不输入的话默认100 */
  width?: number
  searchName?: string
}
const Switch = (props: SwitchProps) => {
  return (
    <div className='w-fit flex justify-center'>
      {props.searchName}：
      <div className='mt-[-2px]'>
        <AntdSwitch {...omit(props, ['searchName'])} />
      </div>
    </div>
  )
}

export default Switch
