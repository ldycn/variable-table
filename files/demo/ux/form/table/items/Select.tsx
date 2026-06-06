import { useFieldRegistration } from '@/ux/form/field'
import useSelect, { SelectOption } from '@/ux/searcher/items/useSelect'
import { Select as AntdSelect, SelectProps as AntdSelectProps } from 'antd'
import FormItem, { FormItemProps } from 'antd/es/form/FormItem'
import { omit } from 'lodash'
import React, { useCallback, useRef, useState } from 'react'

export interface SelectProps extends Omit<AntdSelectProps, 'placeholder'> {
  _?: any
  keyName?: string
  options?: SelectOption[]
  getOptions?: () => SelectOption[] | Promise<SelectOption[]>
  init?: boolean
  index: number
  formItemProps?: FormItemProps
}

const createOptions = (originOptions): Promise<any[]> =>
  originOptions.map(v => {
    if (!v.valueLabel && typeof v.label !== 'string') {
      return { ...v, labelInValue: v.label }
    }
    const text = v.valueLabel || v.label
    return { ...v, labelInValue: text.length > 9 ? text.slice(0, 9) + '...' : text.slice(0, 9) }
  })

const Select = React.forwardRef<any, SelectProps>((props, ref) => {
  const innerRef = useRef<any>(null)
  const mergedRef = ref || innerRef
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const focus = useCallback(() => {
    const el = (mergedRef as any)?.current ?? mergedRef
    el?.focus?.()
  }, [mergedRef])

  const shouldNavigate = useCallback(
    () => !dropdownOpen,
    [dropdownOpen]
  )

  const { handleKeyDown } = useFieldRegistration({ type: 'select', focus, shouldNavigate })

  const getOptions = async () => {
    if (props.getOptions) {
      const options = (await props.getOptions()) || []
      return createOptions(options)
    }
    return []
  }
  const { options } = useSelect({
    ...props,
    getOptions,
    propsOptions: props.options,
    key: props.keyName
  })
  let rules = props.formItemProps?.rules || []
  rules = rules.filter(v => (v as any).required !== true)
  rules.push({ required: true, message: '请选择' + props.formItemProps?.label + '！' })

  return (
    <FormItem {...props.formItemProps} rules={rules} shouldUpdate label={undefined}>
      <AntdSelect
        {...omit(props, ['options', 'placeholder', 'prefix'])}
        ref={mergedRef}
        options={options}
        maxTagTextLength={10}
        maxTagCount={1}
        allowClear
        dropdownMatchSelectWidth={false}
        optionLabelProp='labelInValue'
        onDropdownVisibleChange={(open) => {
          setDropdownOpen(open)
          props.onDropdownVisibleChange?.(open)
        }}
        onKeyDown={e => {
          handleKeyDown(e)
        }}
      />
    </FormItem>
  )
})

Select.displayName = 'Select'

export default Select
