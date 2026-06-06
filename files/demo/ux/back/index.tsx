/**
 * 后退/前进拦截 React Hooks 与工具函数
 *
 * 提供 useBackBlocker hook（用于拦截浏览器后退/前进）和
 * handleBackResult 工具函数（用于页面内返回按钮的确认逻辑）。
 *
 * 使用方式：
 * - useBackBlocker(handler)：在组件中注册拦截，配合 react-activation 的
 *   keep-alive 生命周期自动注册/注销
 * - handleBackResult(result, defaultBack)：在 EntityEditPage / EntityAddPage
 *   的工具栏返回按钮点击时调用，根据表单状态弹出确认弹窗
 */
import { modal } from '@/ux/modal'
import { Button } from 'antd'
import { useEffect, useRef } from 'react'
import { useActivate, useUnactivate } from 'react-activation'
import {
  registerBackBlock,
  unregisterBackBlock,
  markSkipNext
} from './backBlockManager'
import type { BackResult, NavigationDirection } from './backBlockManager'

export type { BackResult }
export type { NavigationDirection }

type BackHandler = () => BackResult | Promise<BackResult>

/**
 * 注册浏览器后退/前进拦截器
 *
 * 当用户点击浏览器后退/前进按钮时，会调用 handler 获取 BackResult，
 * 由 BackBlockProvider 中注入的 ProcessingFn 统一处理结果。
 *
 * 自动配合 react-activation 的 keep-alive 机制：
 * - useActivate（页面激活时）→ 注册拦截
 * - useUnactivate（页面缓存时）→ 注销拦截
 * - useEffect cleanup（页面卸载时）→ 注销拦截
 */
export function useBackBlocker(handler: BackHandler) {
  const handlerRef = useRef(handler)
  handlerRef.current = handler

  const register = () => registerBackBlock(() => handlerRef.current())

  useEffect(() => {
    register()
    return () => unregisterBackBlock()
  }, [])

  useActivate(() => {
    register()
  })

  useUnactivate(() => {
    unregisterBackBlock()
  })
}

/**
 * 处理 BackResult 并执行导航（用于页面内返回按钮）
 *
 * 由 EntityEditPage / EntityAddPage 的工具栏返回按钮调用。
 * 与 BackBlockProvider 的处理逻辑一致，但导航方式由调用方通过
 * defaultBack 参数控制（如 navigate(-1) 或 closeTab()）。
 *
 * @param result - useBackBlocker handler 返回的结果
 * @param defaultBack - 确认离开后执行的导航函数
 * @param direction - 导航方向，影响按钮文案
 */
export function handleBackResult(
  result: BackResult,
  defaultBack: () => void,
  direction: NavigationDirection = 'back'
): Promise<void> {
  const goText = direction === 'forward' ? '直接前进' : '直接返回'
  const saveText = direction === 'forward' ? '保存并前进' : '保存并返回'

  if (typeof result === 'boolean') {
    if (result) {
      markSkipNext()
      defaultBack()
    }
    return Promise.resolve()
  }

  if (!result.isFormChanged) {
    if (result.continue) {
      markSkipNext()
      defaultBack()
    }
    return Promise.resolve()
  }

  return new Promise(resolve => {
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
                defaultBack()
                resolve()
              }}
            >
              {goText}
            </Button>
            <Button
              type='primary'
              onClick={async () => {
                const saved = await result.onSave?.()
                instance.close()
                if (saved) {
                  markSkipNext()
                  defaultBack()
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
}
