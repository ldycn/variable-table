import React, { ReactElement, ReactNode } from 'react'

type SiderOption = { comp: ReactNode; props: ReactElement<'div'> }
type PagePropsItem = {
  grow?: number
  Sider?: ReactNode | SiderOption
  index?: number
  comp?: ReactNode
  blocks?: PagePropsItem[]
}

type PageProps = Omit<PagePropsItem, 'index'>

const BLOCK_GAP = 16 // 所有 block 之间的固定间距（px）

const PageBlock: React.FC<PagePropsItem> = ({ Sider, blocks, index, comp, grow }) => {
  return (
    <div
      className={`flex w-full h-full box-border items-stretch h-full`}
      style={{
        paddingTop: index && index !== 0 ? `${BLOCK_GAP}px` : '',
        flexGrow: grow
      }}
    >
      {/* Sider */}
      {Sider && (
        <div
          className={`shrink-0`}
          style={{
            marginRight: `${BLOCK_GAP}px`
          }}
          {...((Sider as SiderOption).props || {})}
        >
          {(Sider as SiderOption).comp ? (Sider as SiderOption).comp : (Sider as ReactNode)}
        </div>
      )}
      {/* Main Content */}
      {comp
        ? comp
        : blocks &&
          blocks.length > 0 && (
            <div className={`w-[0] grow-1 flex flex-col flex-1`}>
              {blocks.map((block, index) => (
                <div
                  key={index}
                  className={`w-full `}
                  style={{
                    flexGrow: block.grow,
                    // marginTop: !!index ? BLOCK_GAP : undefined,
                    height: block.grow ? 0 : undefined
                  }}
                >
                  <PageBlock key={index} {...block} index={index} />
                </div>
              ))}
            </div>
          )}
    </div>
  )
}

const Page: React.FC<PageProps> = props => {
  return (
    <div className='box-border p-[16px] bg-[#F7F8FC] h-full w-full'>
      <PageBlock {...props} />
    </div>
  )
}

export default Page
