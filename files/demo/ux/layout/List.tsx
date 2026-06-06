import React, { ReactNode } from 'react'

interface ListProps extends React.ComponentProps<'div'> {
  items: ReactNode[]
}

const List: React.FC<ListProps> = props => {
  return <div className={'h-full w-full ' + props.className}>{props.items}</div>
}

export default List
