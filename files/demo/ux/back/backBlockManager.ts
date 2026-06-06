/**
 * 浏览器后退/前进拦截管理器
 *
 * 通过拦截 popstate 事件，在用户点击浏览器后退/前进按钮时，
 * 先将历史记录恢复原位，再调用注册的回调函数决定是否允许导航。
 *
 * 典型使用场景：表单编辑页面防止用户未保存就离开。
 *
 * 核心流程：
 * 1. popstate 事件触发 → 立即 history.go() 恢复历史位置
 * 2. 调用注册的回调函数获取 BackResult
 * 3. 将 BackResult 交给 ProcessingFn（由 BackBlockProvider 设置）处理
 * 4. ProcessingFn 根据结果弹出确认弹窗或直接放行导航
 */

type BackCallback = () => BackResult | Promise<BackResult>

/**
 * 回调函数的返回值类型：
 * - boolean: true 表示允许导航，false 表示阻止导航
 * - 对象形式：包含表单是否变更的标记，以及保存回调
 */
export type BackResult =
  | boolean
  | { isFormChanged: boolean; continue?: any; onSave?: () => Promise<boolean | void> }

/** 导航方向：后退或前进 */
export type NavigationDirection = 'back' | 'forward'

/** 处理 BackResult 的函数类型，由 BackBlockProvider 注入 */
type ProcessingFn = (result: BackResult, direction: NavigationDirection) => Promise<void>

/** 当前注册的拦截回调（全局单例，同一时间只有一个页面能拦截） */
let currentCallback: BackCallback | null = null
/** 是否跳过下一次 popstate 事件的拦截（用于放行已确认的导航） */
let _skipNext = false
/** 是否正在恢复历史记录位置（防止恢复操作本身触发拦截） */
let _restoring = false
/** 是否正在处理一次拦截（防止并发处理） */
let _processing = false
/** 处理 BackResult 的函数，由 BackBlockProvider 通过 setProcessingFn 注入 */
let _processingFn: ProcessingFn | null = null
/** popstate 监听器是否已挂载 */
let _mounted = false
/** 当前历史记录索引，用于判断导航方向（前进 or 后退） */
let _currentIdx: number = history.state?.idx ?? 0

// 猴子补丁：劫持 pushState 和 replaceState，同步跟踪 history index
const _origPushState = history.pushState.bind(history)
history.pushState = function (...args: Parameters<typeof history.pushState>) {
  _origPushState(...args)
  _currentIdx = history.state?.idx ?? _currentIdx
}

const _origReplaceState = history.replaceState.bind(history)
history.replaceState = function (...args: Parameters<typeof history.replaceState>) {
  _origReplaceState(...args)
  _currentIdx = history.state?.idx ?? _currentIdx
}

/**
 * popstate 事件处理器
 *
 * 核心拦截逻辑：
 * 1. 如果是恢复操作或跳过标记，直接放行
 * 2. 如果没有注册回调或正在处理中，直接放行
 * 3. 否则：阻止事件传播 → 恢复历史位置 → 调用回调 → 交给 ProcessingFn 处理
 */
function handlePopState(event: PopStateEvent) {
  const incomingIdx = event.state?.idx

  // 恢复操作（history.go 触发），正常放行
  if (_restoring) {
    _restoring = false
    _currentIdx = incomingIdx ?? _currentIdx
    return
  }

  // 已确认的导航，跳过拦截
  if (_skipNext) {
    _skipNext = false
    _currentIdx = incomingIdx ?? _currentIdx
    return
  }

  const cb = currentCallback
  // 没有注册回调或正在处理中，直接放行
  if (!cb || _processing) {
    _currentIdx = incomingIdx ?? _currentIdx
    return
  }

  // 通过比较历史索引判断导航方向
  const direction: NavigationDirection =
    (incomingIdx ?? 0) > _currentIdx ? 'forward' : 'back'

  // 阻止其他 popstate 监听器响应
  event.stopImmediatePropagation()

  _processing = true
  _restoring = true

  // 恢复历史记录位置：如果是前进则回退一步，如果是后退则前进一步
  if (direction === 'forward') {
    history.go(-1)
  } else {
    history.go(1)
  }

  // 延迟执行回调，确保历史位置已恢复
  setTimeout(() => {
    Promise.resolve(cb())
      .then(async (result) => {
        if (_processingFn) {
          await _processingFn(result, direction)
        }
      })
      .catch(() => {})
      .finally(() => {
        _processing = false
      })
  }, 100)
}

/** 在应用启动时调用（main.tsx），注册全局 popstate 监听器 */
export function initBackBlockListener() {
  if (_mounted) return
  _mounted = true
  _currentIdx = history.state?.idx ?? 0
  window.addEventListener('popstate', handlePopState, true)
}

/** 注册后退/前进拦截回调（全局单例，后注册的会覆盖先注册的） */
export function registerBackBlock(cb: BackCallback) {
  currentCallback = cb
}

/** 注销拦截回调，不再拦截浏览器导航 */
export function unregisterBackBlock() {
  currentCallback = null
}

/** 标记下一次 popstate 事件直接放行，用于已确认的导航 */
export function markSkipNext() {
  _skipNext = true
}

/** 设置 BackResult 处理函数，由 BackBlockProvider 调用注入 */
export function setProcessingFn(fn: ProcessingFn) {
  _processingFn = fn
}

/** 重置所有状态，在页面从 bfcache 恢复时调用（pageshow 事件） */
export function clearBackBlockState() {
  currentCallback = null
  _skipNext = false
  _restoring = false
  _processing = false
}
