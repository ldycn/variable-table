import { useAsyncEffect } from 'ahooks'
import useFormInstance from 'antd/es/form/hooks/useFormInstance'
import { ReactNode, useEffect, useState } from 'react'
import { FORM_ATTR_PREFIX } from './constants'

export type SelectOption = { value: any; label: ReactNode; valueLabel?: string }
const useSelect = ({
  propsOptions,
  getOptions = (() => [] as any) as () => SelectOption[] | Promise<SelectOption[]>,
  key,
  init = false,
  index = undefined
}) => {
  const [options, setOptions] = useState<SelectOption[]>(() => (propsOptions as SelectOption[]) || [])
  const form = useFormInstance()
  useEffect(() => {
    if (form && getOptions) {
      form.setFieldsValue({
        [FORM_ATTR_PREFIX + key + (index || '')]: getOptions
      })
    } else if (form) {
      form.setFieldsValue({
        [FORM_ATTR_PREFIX + key + (index || '')]: undefined
      })
    }
  }, [])

  useAsyncEffect(async () => {
    if (init) {
      const newOptions = await getOptions()
      setOptions(newOptions || [])
    }
  }, [])
  useAsyncEffect(async () => {
    setOptions((propsOptions as SelectOption[]) || [])
  }, [propsOptions])
  return { options }
}
export default useSelect
