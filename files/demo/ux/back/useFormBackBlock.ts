/**
 * 表单变更感知的后退拦截 Hook
 *
 * 将 useBackBlocker 与表单变更检测结合，提供开箱即用的表单离开拦截。
 *
 * 使用方式：
 * 1. 在表单页面中调用 useFormBackBlock({ getDTO, onSave })
 * 2. 在表单数据加载完成后调用 updateInitialData() 记录初始快照
 * 3. 当用户触发浏览器后退/前进时，自动比较当前表单数据与初始快照：
 *    - 未变更 → 直接放行
 *    - 已变更 → 弹出确认弹窗（由 BackBlockProvider 处理）
 *
 * 被广泛用于各模块的 Add/Edit 页面（如 store/EditPage、supplier-base、
 * quickInventoryBase、adjustBase 等）。
 */
import { useBackBlocker } from '@/ux/back'
import { isFormChanged } from '@shared/utils/is-form-changed'
import { useCallback, useRef } from 'react'

export interface UseFormBackBlockOptions {
  /** 获取当前表单数据的函数，用于与初始快照比较 */
  getDTO: () => Record<string, any>
  /** 保存表单数据的函数，弹窗点击"保存并离开"时调用 */
  onSave: () => Promise<boolean | void>
  /**
   * Ant Design Form 实例，传入后"保存并返回/前进"会先执行 form.validateFields()
   * 验证不通过则阻止保存和导航，与"完成"按钮行为一致
   */
  form?: { validateFields: () => Promise<any> }
}

export function useFormBackBlock(options: UseFormBackBlockOptions) {
  const { getDTO, onSave, form } = options
  const initialDataRef = useRef<Record<string, any>>({})

  const updateInitialData = useCallback(() => {
    setTimeout(() => {
      initialDataRef.current = getDTO()
    }, 0)
  }, [getDTO])

  const wrappedOnSave = useCallback(async () => {
    if (form) {
      try {
        await form.validateFields()
      } catch {
        return false as const
      }
    }
    return await onSave()
  }, [form, onSave])

  const onBack = useCallback(() => {
    const newData = getDTO()
    const changed = isFormChanged(initialDataRef.current, newData)
    return {
      isFormChanged: changed,
      continue: true,
      onSave: wrappedOnSave
    }
  }, [getDTO, wrappedOnSave])

  useBackBlocker(onBack)

  return {
    initialDataRef,
    updateInitialData,
    onBack
  }
}
