/**
 * 后退拦截的 React 上下文提供者
 *
 * 挂载在路由外层（shared/router/index.tsx），为整个应用提供
 * 浏览器后退/前进拦截时的 UI 处理逻辑。
 *
 * 通过 setProcessingFn 将处理函数注入到 backBlockManager 中，
 * 当用户触发浏览器后退/前进时，backBlockManager 会调用此处理函数，
 * 根据表单变更状态决定：直接放行 / 弹出确认弹窗。
 */
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { modal } from '@/ux/modal'
import { Button } from 'antd'
import {
  markSkipNext,
  setProcessingFn
} from './backBlockManager'
import type { NavigationDirection } from './backBlockManager'

export function BackBlockProvider({ children }: { children: React.ReactNode }) {
  // 使用 ref 持有 navigate，避免闭包引用过期
  const navigateRef = useRef(useNavigate())
  navigateRef.current = useNavigate()

  useEffect(() => {
    /**
     * 处理 backBlockManager 传递过来的 BackResult：
     * 1. boolean true → 直接放行导航
     * 2. 表单未变更且 continue 为 true → 直接放行
     * 3. 表单已变更 → 弹出确认弹窗，提供"取消"/"直接离开"/"保存并离开"三个选项
     */
    setProcessingFn(async (result, direction) => {
      const navigateDelta = direction === 'forward' ? 1 : -1
      const leaveText = direction === 'forward' ? '直接前进' : '直接返回'
      const saveText = direction === 'forward' ? '保存并前进' : '保存并返回'

      // boolean 结果：true 表示直接允许导航
      if (typeof result === 'boolean') {
        if (result) {
          markSkipNext()
          navigateRef.current(navigateDelta)
        }
        return
      }

      // 表单未变更：根据 continue 标记决定是否放行
      if (!result.isFormChanged) {
        if (result.continue) {
          markSkipNext()
          navigateRef.current(navigateDelta)
        }
        return
      }

      // 表单已变更：弹出确认弹窗，等待用户选择
      await new Promise<void>(resolve => {
        const instance = modal({
          title: '提示',
          maskClosable: false,
          content: <div className='p-[16px]'>当前有未保存的表单内容，是否保存后退出？</div>,
          footer: (
            <div className='h-[48px] w-full border-t border-t-[#DCDFE6] flex justify-end items-center'>
              <div className='mx-[16px] flex items-center gap-[12px]'>
                <Button
                  onClick={() => {
                    instance.close()
                    resolve()
                  }}
                >
                  取消
                </Button>
                <Button
                  onClick={() => {
                    instance.close()
                    markSkipNext()
                    navigateRef.current(navigateDelta)
                    resolve()
                  }}
                >
                  {leaveText}
                </Button>
                <Button
                  type='primary'
                  onClick={async () => {
                    const saved = await result.onSave?.()
                    instance.close()
                    if (saved) {
                      markSkipNext()
                      navigateRef.current(navigateDelta)
                    }
                    resolve()
                  }}
                >
                  {saveText}
                </Button>
              </div>
            </div>
          )
        })
      })
    })
  }, [])

  return <>{children}</>
}
