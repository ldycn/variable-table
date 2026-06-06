import { message } from 'antd'
import { isArray, isNil, isObject, pickBy } from 'lodash'
import { ACCESSTOKEN } from '../types/login-info'
import { SessionStorageManager } from './session-storage'

export const fetchClient = async (url: string, options: RequestInit = {}) => {
  const api = (() => {
    switch (import.meta.env.MODE) {
      case 'development':
        return '/api'
      case 'dev':
        return 'https://dev-zhengda.nuosizhiyun.cn'
      case 'test':
        return 'https://test-zhengda.nuosizhiyun.cn'
      case 'staging':
        return 'https://test-zhengda.nuosi.cloud'
      case 'production':
        return 'https://zhengda.nuosi.cloud'
      case 'main':
        return 'https://zhengda.nuosizhiyun.cn'  // 预发布域名
      default:
        throw new Error(
          `不支持的环境模式: ${import.meta.env.MODE
          }，请检查环境变量是否属于development、staging、production`
        )
    }
  })()

  const accessToken = SessionStorageManager.get(ACCESSTOKEN)
  const defaultHeaders: HeadersInit = {}

  // 只有当 body 不是 FormData 时才设置 Content-Type，因为FormData是上传文件，不能设置为application/json
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json'
  }

  if (accessToken) {
    defaultHeaders['Authorization'] = accessToken
    defaultHeaders['type'] = 'b'
  }

  const mergedOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    },
    credentials: 'include'
  }
  const response = await fetch(`${api}${url}`, mergedOptions)

  if (!response.ok) {
    if (response.status === 404) return
    if (response.status === 401) {
      window.location.href = '/sign-in'
    }
    const errorData = await response.json()
    throw new Error(errorData.message || '请求失败')
  }

  // 如果返回的不是json，那么直接返回response不处理
  if (!response.headers.get('Content-Type')?.includes('application/json')) {
    return response
  }

  const keywords = [
    '/miss-wholesale/WholesaleCalculate/pcRefundWithOriginalOrderSku'
  ];

  const data = (await response.json()) as {
    code: number
    msg: string
    data: any
  }

  if (keywords.some(path => new RegExp(`${path}(\\?|$)`).test(response.url))) { // 白名单：如果接口路径包含在关键词列表中，则接口 500 时为直接返回数据，不进行统一抛错
    if (data.code === 500) {
      return data;
    }
  }

  if (data.code >= 200 && data.code <= 299) {
    return data
  }

  if (data.code === 401) {
    message.warning('登录过期，请重新登录')
    window.location.href = '/sign-in'
  } else if (data.code === 403) {
    message.warning(`没有权限: ${data.msg}`)
    throw new Error(JSON.stringify(data))
  } else if (data.code === 500) {
    message.error({
      content: data.msg,
      key: 'error'
    })
    throw new Error(JSON.stringify(data))
    // return {
    //   ...data,
    //   error: true,
    // };
  }

  return data
}

const removeNilValues = input => {
  // 如果不是对象或者是数组，直接返回原值
  if (!isObject(input) || isArray(input)) {
    return input
  }

  // 使用 pickBy 剔除值为 null 或 undefined 的属性
  return pickBy(input, value => !isNil(value))
}
// GET 请求封装
export const get = async <T> (
  url: string,
  params: Record<string, any> = {},
  options: RequestInit = {}
): Promise<T> => {
  const query = new URLSearchParams(removeNilValues(params)).toString()
  const fullUrl = query ? `${url}?${query}` : url

  return fetchClient(fullUrl, { ...options, method: 'GET' }) as Promise<T>
}

// POST 方法封装 api
export const post = async <T> (
  url: string,
  body: Record<string, any> = {},
  options: RequestInit = {}
): Promise<T> => {
  return fetchClient(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(removeNilValues(body))
  }) as Promise<T>
}

// PUT 方法封装 api
export const put = async <T> (
  url: string,
  body: Record<string, any> = {},
  options: RequestInit = {}
): Promise<T> => {
  return fetchClient(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(removeNilValues(body))
  }) as Promise<T>
}

// DELETE 方法封装 api
export const del = async <T> (url: string, options: RequestInit = {}): Promise<T> => {
  return fetchClient(url, { ...options, method: 'DELETE' }) as Promise<T>
}

// 获取 API 基础地址
export const getApiBaseUrl = () => {
  switch (import.meta.env.MODE) {
    case 'development':
      return '/api'
    case 'dev':
      return 'https://dev-zhengda.nuosizhiyun.cn'
    case 'test':
      return 'https://test-zhengda.nuosizhiyun.cn'
    case 'staging':
      return 'https://test-zhengda.nuosi.cloud'
    case 'production':
      return 'http://zhengda.nuosi.cloud'
    case 'main':
      return 'https://zhengda.nuosizhiyun.cn'   // 预发布环境域名
    default:
      return '/api'
  }
}

// 处理图片 URL，如果是相对路径则拼接完整域名
export const processImageUrl = (url: string | null | undefined): string => {
  if (!url || typeof url !== 'string' || url.trim() === '') return ''

  const trimmedUrl = url.trim()

  // 如果已经是完整 URL（包含 http:// 或 https://）
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    try {
      const parsed = new URL(trimmedUrl)
      const apiBase = getApiBaseUrl()

      // 如果是内网 IP 地址（如 11.13.x.x, 192.168.x.x, 10.x.x.x），需要替换为当前环境的 API 域名
      const isInternalIP = /^(http:\/\/)?(11\.|192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(
        trimmedUrl
      )

      if (apiBase.startsWith('https://') && (isInternalIP || parsed.protocol === 'http:')) {
        // 在 HTTPS 环境下，将 HTTP 或内网地址转换为当前环境的 HTTPS 地址
        const apiParsed = new URL(apiBase)
        // 保留路径和查询参数
        const pathAndQuery = `${parsed.pathname}${parsed.search || ''}${parsed.hash || ''}`
        const rebuilt = `${apiParsed.origin}${pathAndQuery}`
        return rebuilt
      }

      // 如果已经是 HTTPS 且不是内网地址，直接返回
      return trimmedUrl
    } catch (error) {
      // URL 解析失败，尝试直接返回或拼接
      console.warn('图片 URL 解析失败:', trimmedUrl, error)
      return trimmedUrl
    }
  }

  // 如果是相对路径，拼接 API 基础地址
  const apiBase = getApiBaseUrl()

  // 确保 URL 以 / 开头
  const imagePath = trimmedUrl.startsWith('/') ? trimmedUrl : `/${trimmedUrl}`

  // 如果是开发环境使用 /api，直接拼接
  if (apiBase === '/api') {
    return `${apiBase}${imagePath}`
  }

  // 其他环境拼接完整域名
  return `${apiBase}${imagePath}`
}
