import { omit } from 'lodash'
import { useEffect, useRef } from 'react'

const ScrollableTh = props => {
  const { onResize, width, columnInfo, ...restProps } = props
  const beginClientX = useRef(-1)
  const beginWidth = useRef(-1)

  // 在 document 上监听 mousemove
  useEffect(() => {
    const handleMouseMove = e => {
      if (beginClientX.current !== -1) {
        const newX = e.clientX
        const newWidth = beginWidth.current + (newX - beginClientX.current)
        onResize(
          Math.min(
            Math.max(newWidth, columnInfo.scrollMinWidth || 0),
            columnInfo.scrollMaxWidth || Infinity
          )
        )
      }
    }

    const handleMouseUp = () => {
      beginClientX.current = -1
      beginWidth.current = -1
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [width, onResize])
  if (
    props.className.includes('ant-table-selection-column') ||
    props.className.includes('ant-table-cell-scrollbar') ||
    !props.columnInfo ||
    props.columnInfo.resizeable === false
  ) {
    return <th {...props} />
  }
  return (
    <th className={props.className + ' select-none'} {...omit(props, ['children', 'className'])}>
      <div className='flex justify-between w-full'>
        {restProps.children}
        <div
          className='w-[24px] h-[22px] float-right mr-[-8px] cursor-pointer inline-flex justify-center'
          onMouseDown={e => {
            beginClientX.current = e.clientX
            beginWidth.current = width
          }}
        >
          <span className='h-full w-[1px] bg-[#DCDFE6] mr-[-8px]' />
        </div>
      </div>
    </th>
  )
}

export default ScrollableTh
