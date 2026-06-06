import { useEffect, useState } from 'react'

interface UseArrowFocusTableOptions<T> {
  tableCount: number
  formItemRefs
  formCount: number
  onEnterRow?: (row: T) => void
  open: boolean
  data: any[]
  onEnter: (isTable, itemIndex) => void
}

function useKey<T>({
  tableCount,
  formCount,
  formItemRefs,
  open,
  data,
  onEnter
}: UseArrowFocusTableOptions<T>) {
  /** 当前聚焦索引 */
  const [focusIndex, setFocusIndex] = useState(0)

  const totalLength = formCount + tableCount

  /** 设置真实 DOM 焦点 */
  useEffect(() => {
    setTimeout(() => {
      // formItemRefs.current.map(v => v?.formElement?.blur?.())
      if (focusIndex < formCount) {
        formItemRefs.current[focusIndex]?.formElement?.focus?.()
      }
    }, 500)
  }, [focusIndex, formCount])
  useEffect(() => {
    const fn = e => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusIndex(i => Math.min(i + 1, totalLength - 1))
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusIndex(i => Math.max(i - 1, 0))
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        onEnter(focusIndex - formCount >= 0 && tableCount !== 0, focusIndex - formCount)
      }
    }
    if (open) {
      window.document.addEventListener('keydown', fn)
    }
    return () => {
      window.document.removeEventListener('keydown', fn)
    }
  }, [focusIndex, totalLength, formCount, open, data])
  return {
    focusedTableIndex: focusIndex - formCount,
    setFocusIndex(index) {
      setFocusIndex(index + formCount)
    }
    /** 当前聚焦索引 */
  }
}
export default useKey
