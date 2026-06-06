import { Form } from 'antd'
import { isNil } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'

export interface RenderProps {
  dependencies?: string[]
  children: (values: Record<string, any>) => React.ReactNode
}

const Render = (props: RenderProps) => {
  const { dependencies, children } = props
  const form = Form.useFormInstance()

  const [, forceUpdate] = useState({})

  const prevValuesRef = useRef(form.getFieldsValue(true))

  const watchedValues = Form.useWatch(dependencies, form)

  useEffect(() => {
    const current = form.getFieldsValue(true)
    const prev = prevValuesRef.current
    let shouldUpdate = false

    for (const dep of dependencies) {
      const prevVal = prev[dep]
      const currVal = current[dep]

      if (isNil(prevVal)) {
        shouldUpdate = JSON.stringify(prev) !== JSON.stringify(current)
      } else {
        shouldUpdate = JSON.stringify(prevVal) !== JSON.stringify(currVal)
      }

      if (shouldUpdate) break
    }

    prevValuesRef.current = current
    if (shouldUpdate) {
      forceUpdate({})
    }
  }, [watchedValues, form, dependencies])

  const currentValues = form.getFieldsValue(true)

  return <>{children(currentValues)}</>
}

export default Render
