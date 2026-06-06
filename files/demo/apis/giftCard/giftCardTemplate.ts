import { del, get, post } from '@/shared/utils/fetch'

// MOCK 开关，设置为 true 使用 mock 数据
const MOCK = false

// ==================== 枚举类型定义 ====================

/** 类别：VALUE_CARD-储值卡、EXCHANGE_VOUCHER-兑换券 */
export type Category = 'VALUE_CARD' | 'EXCHANGE_VOUCHER'

/** 面值模式：FIXED-固定面值、CUSTOM-自定义面值 */
export type AmountMode = 'FIXED' | 'CUSTOM'

/** 介质类型：0-磁条卡、1-IC卡、2-条码卡 */
export type MediaType = 0 | 1 | 2

/** 适用品牌：ALL-全部品牌、INCLUDE-指定品牌可用、EXCLUDE-指定品牌不可用 */
export type ApplicableBrand = 'ALL' | 'INCLUDE' | 'EXCLUDE'

/** 适用门店：ALL-全部门店、SPECIFIC-指定门店 */
export type ApplicableStore = 'ALL' | 'SPECIFIC'

/** 消费密码方式：NONE-无需密码 */
export type ConsumePasswordMode = 'NONE'

/** 卡密格式：NUMERIC-纯数字、ALPHANUMERIC-数字+字母 */
export type PinType = 'NUMERIC' | 'ALPHANUMERIC'

/** 状态：0-草稿、1-启用、2-禁用 */
export type Status = 0 | 1 | 2

// ==================== 枚举显示映射 ====================

export const CategoryEnum: Record<Category, string> = {
  VALUE_CARD: '储值卡',
  EXCHANGE_VOUCHER: '兑换券'
}

export const AmountModeEnum: Record<AmountMode, string> = {
  FIXED: '固定面值',
  CUSTOM: '自定义面值'
}

/** 面值模式枚举（数字类型）：0-固定面值、1-自定义面值 */
export const AmountModeNumberEnum: { [key: number]: string } = {
  0: '固定面值',
  1: '自定义面值'
}

export const MediaTypeEnum: Record<MediaType, string> = {
  0: '磁条卡',
  1: 'IC卡',
  2: '条码卡'
}

export const ApplicableBrandEnum: Record<ApplicableBrand, string> = {
  ALL: '全部品牌',
  INCLUDE: '指定品牌可用',
  EXCLUDE: '指定品牌不可用'
}

export const ApplicableStoreEnum: Record<ApplicableStore, string> = {
  ALL: '全部门店',
  SPECIFIC: '指定门店'
}

export const ConsumePasswordModeEnum: Record<ConsumePasswordMode, string> = {
  NONE: '无需密码'
}

export const PinTypeEnum: Record<PinType, string> = {
  NUMERIC: '纯数字',
  ALPHANUMERIC: '数字+字母'
}

export const StatusEnum: { [key: number]: string } = {
  0: '草稿',
  1: '启用',
  2: '禁用'
}

// ==================== 接口类型定义 ====================

/** 通用API响应类型 */
interface ApiResponse<T> {
  code: number
  msg?: string
  data?: T
}

/** 储值卡类型列表查询参数 */
export interface GiftCardTemplateListParams {
  pageNum?: number
  pageSize?: number
  name?: string
  /** 状态：0-草稿、1-启用、2-禁用 */
  status?: number
  orderByColumn?: string
  isAsc?: string
  reasonable?: boolean
  page?: boolean
}

/** 储值卡类型列表项 */
export interface GiftCardTemplateListItem {
  id: number
  name: string
  status: Status
  amountMode: AmountMode
  amount?: number
  applicableStore: ApplicableStore
  applicableBrand: ApplicableBrand
  validDays: number
  createTime: string
}

/** 储值卡类型列表响应数据 */
export interface GiftCardTemplateListData {
  rows: GiftCardTemplateListItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}

/** 储值卡类型列表响应 */
export type GiftCardTemplateListResponse = ApiResponse<GiftCardTemplateListData>

/** 适用门店 */
export interface ApplicableStoreItem {
  storeId: number
  storeName: string
}

/** 适用品牌 */
export interface ApplicableBrandItem {
  brandId: number
  brandName: string
}

/** 储值卡类型详情 */
export interface GiftCardTemplateDetail {
  id: number
  name: string
  isEditBaseInfo: boolean
  category: Category
  amountMode: AmountMode
  amount?: number
  mediaType: MediaType
  codeTotalLen: number
  codePrefixLen?: number
  pinLen: number
  pinType: PinType
  validDays: number
  consumePasswordMode: ConsumePasswordMode
  applicableStore: ApplicableStore
  applicableBrand: ApplicableBrand
  status: Status
  remark?: string
  createTime: string
  updateTime?: string
  applicableStores?: ApplicableStoreItem[]
  applicableBrands?: ApplicableBrandItem[]
}

/** 储值卡类型详情响应 */
export type GiftCardTemplateDetailResponse = ApiResponse<GiftCardTemplateDetail>

/** 保存或更新储值卡类型请求 */
export interface SaveOrUpdateGiftCardTemplateRequest {
  id?: number
  status: Status
  name?: string
  category?: Category
  amountMode?: AmountMode
  amount?: number
  mediaType?: MediaType
  codeTotalLen?: number
  codePrefixLen?: number
  pinLen?: number
  pinType?: PinType
  validDays?: number
  consumePasswordMode?: ConsumePasswordMode
  applicableStore?: ApplicableStore
  storeIds?: number[]
  applicableBrand?: ApplicableBrand
  brandIds?: number[]
  remark?: string
}

/** 保存或更新响应 */
export interface SaveOrUpdateResponse {
  warn: boolean
  success: boolean
  code: number
  error: boolean
  msg: string
  empty: boolean
}

/** 删除响应 */
export interface DeleteResponse {
  warn: boolean
  success: boolean
  code: number
  error: boolean
  msg: string
  empty: boolean
}

/** 更新状态请求 */
export interface UpdateStatusRequest {
  id: number
  status: 1 | 2
}

/** 更新状态响应 */
export interface UpdateStatusResponse {
  warn: boolean
  success: boolean
  code: number
  error: boolean
  msg: string
  empty: boolean
}

/** 制卡列表项 */
export interface GiftCardTemplateForBatch {
  id: number
  name: string
}

/** 制卡列表响应 */
export type ListForBatchResponse = ApiResponse<GiftCardTemplateForBatch[]>

// ==================== API 接口 ====================

const BASE_URL = '/miss-member/giftCardTemplate'

// Mock 数据生成函数
const generateMockList = (params: GiftCardTemplateListParams): GiftCardTemplateListData => {
  const total = 25
  const pageNum = params.pageNum || 1
  const pageSize = params.pageSize || 20

  const mockData: GiftCardTemplateListItem[] = [
    {
      id: 1,
      name: '标准储值卡',
      status: 1,
      amountMode: 'FIXED',
      amount: 100,
      applicableStore: 'ALL',
      applicableBrand: 'ALL',
      validDays: 365,
      createTime: '2024-01-15 10:30:00'
    },
    {
      id: 2,
      name: 'VIP会员卡',
      status: 1,
      amountMode: 'CUSTOM',
      applicableStore: 'SPECIFIC',
      applicableBrand: 'INCLUDE',
      validDays: 730,
      createTime: '2024-01-16 14:20:00'
    },
    {
      id: 3,
      name: '节日礼品卡',
      status: 2,
      amountMode: 'FIXED',
      amount: 200,
      applicableStore: 'ALL',
      applicableBrand: 'ALL',
      validDays: 180,
      createTime: '2024-01-18 09:15:00'
    },
    {
      id: 4,
      name: '员工福利卡',
      status: 1,
      amountMode: 'FIXED',
      amount: 500,
      applicableStore: 'ALL',
      applicableBrand: 'ALL',
      validDays: 365,
      createTime: '2024-01-20 16:45:00'
    },
    {
      id: 5,
      name: '促销优惠券',
      status: 0,
      amountMode: 'FIXED',
      amount: 50,
      applicableStore: 'SPECIFIC',
      applicableBrand: 'EXCLUDE',
      validDays: 30,
      createTime: '2024-01-22 11:00:00'
    },
    {
      id: 6,
      name: '金卡会员',
      status: 1,
      amountMode: 'CUSTOM',
      applicableStore: 'ALL',
      applicableBrand: 'ALL',
      validDays: 1095,
      createTime: '2024-01-25 13:30:00'
    },
    {
      id: 7,
      name: '银卡会员',
      status: 1,
      amountMode: 'FIXED',
      amount: 300,
      applicableStore: 'ALL',
      applicableBrand: 'ALL',
      validDays: 365,
      createTime: '2024-01-28 10:00:00'
    },
    {
      id: 8,
      name: '铜卡会员',
      status: 2,
      amountMode: 'FIXED',
      amount: 100,
      applicableStore: 'ALL',
      applicableBrand: 'ALL',
      validDays: 180,
      createTime: '2024-02-01 15:20:00'
    },
    {
      id: 9,
      name: '生日礼品卡',
      status: 1,
      amountMode: 'FIXED',
      amount: 200,
      applicableStore: 'ALL',
      applicableBrand: 'ALL',
      validDays: 90,
      createTime: '2024-02-05 09:45:00'
    },
    {
      id: 10,
      name: '周年庆卡',
      status: 1,
      amountMode: 'CUSTOM',
      applicableStore: 'SPECIFIC',
      applicableBrand: 'INCLUDE',
      validDays: 365,
      createTime: '2024-02-10 14:00:00'
    },
    {
      id: 11,
      name: '新客户体验卡',
      status: 0,
      amountMode: 'FIXED',
      amount: 30,
      applicableStore: 'ALL',
      applicableBrand: 'ALL',
      validDays: 7,
      createTime: '2024-02-15 11:30:00'
    },
    {
      id: 12,
      name: '老客户回馈卡',
      status: 1,
      amountMode: 'FIXED',
      amount: 150,
      applicableStore: 'ALL',
      applicableBrand: 'ALL',
      validDays: 365,
      createTime: '2024-02-20 16:00:00'
    },
    {
      id: 13,
      name: '春节特惠卡',
      status: 2,
      amountMode: 'FIXED',
      amount: 188,
      applicableStore: 'ALL',
      applicableBrand: 'ALL',
      validDays: 60,
      createTime: '2024-02-25 10:15:00'
    },
    {
      id: 14,
      name: '情人节礼品卡',
      status: 1,
      amountMode: 'FIXED',
      amount: 520,
      applicableStore: 'ALL',
      applicableBrand: 'ALL',
      validDays: 30,
      createTime: '2024-03-01 13:45:00'
    },
    {
      id: 15,
      name: '企业团购卡',
      status: 1,
      amountMode: 'CUSTOM',
      applicableStore: 'SPECIFIC',
      applicableBrand: 'ALL',
      validDays: 730,
      createTime: '2024-03-05 09:00:00'
    },
    {
      id: 16,
      name: '学生优惠卡',
      status: 1,
      amountMode: 'FIXED',
      amount: 80,
      applicableStore: 'ALL',
      applicableBrand: 'ALL',
      validDays: 365,
      createTime: '2024-03-10 15:30:00'
    },
    {
      id: 17,
      name: '老年优待卡',
      status: 2,
      amountMode: 'FIXED',
      amount: 50,
      applicableStore: 'ALL',
      applicableBrand: 'ALL',
      validDays: 365,
      createTime: '2024-03-15 11:00:00'
    },
    {
      id: 18,
      name: '会员积分卡',
      status: 1,
      amountMode: 'CUSTOM',
      applicableStore: 'ALL',
      applicableBrand: 'INCLUDE',
      validDays: 1095,
      createTime: '2024-03-20 14:20:00'
    },
    {
      id: 19,
      name: '限时抢购卡',
      status: 0,
      amountMode: 'FIXED',
      amount: 99,
      applicableStore: 'ALL',
      applicableBrand: 'ALL',
      validDays: 3,
      createTime: '2024-03-25 10:45:00'
    },
    {
      id: 20,
      name: '豪华尊享卡',
      status: 1,
      amountMode: 'FIXED',
      amount: 1000,
      applicableStore: 'ALL',
      applicableBrand: 'ALL',
      validDays: 365,
      createTime: '2024-03-30 16:30:00'
    },
    {
      id: 21,
      name: '普通会员卡',
      status: 1,
      amountMode: 'FIXED',
      amount: 200,
      applicableStore: 'ALL',
      applicableBrand: 'ALL',
      validDays: 365,
      createTime: '2024-04-05 09:30:00'
    },
    {
      id: 22,
      name: '钻石会员卡',
      status: 1,
      amountMode: 'CUSTOM',
      applicableStore: 'SPECIFIC',
      applicableBrand: 'ALL',
      validDays: 1825,
      createTime: '2024-04-10 13:00:00'
    },
    {
      id: 23,
      name: '试用体验卡',
      status: 2,
      amountMode: 'FIXED',
      amount: 20,
      applicableStore: 'ALL',
      applicableBrand: 'ALL',
      validDays: 15,
      createTime: '2024-04-15 11:45:00'
    },
    {
      id: 24,
      name: '合作伙伴卡',
      status: 1,
      amountMode: 'FIXED',
      amount: 800,
      applicableStore: 'SPECIFIC',
      applicableBrand: 'INCLUDE',
      validDays: 730,
      createTime: '2024-04-20 15:15:00'
    },
    {
      id: 25,
      name: '内部员工卡',
      status: 1,
      amountMode: 'CUSTOM',
      applicableStore: 'ALL',
      applicableBrand: 'ALL',
      validDays: 3650,
      createTime: '2024-04-25 10:00:00'
    },
    {
      id: 26,
      name: '草稿卡类型-待配置A',
      status: 0,
      amountMode: 'FIXED',
      amount: 150,
      applicableStore: 'ALL',
      applicableBrand: 'ALL',
      validDays: 365,
      createTime: '2024-05-01 09:00:00'
    },
    {
      id: 27,
      name: '草稿卡类型-待配置B',
      status: 0,
      amountMode: 'CUSTOM',
      applicableStore: 'SPECIFIC',
      applicableBrand: 'INCLUDE',
      validDays: 180,
      createTime: '2024-05-02 10:30:00'
    },
    {
      id: 28,
      name: '草稿卡类型-待配置C',
      status: 0,
      amountMode: 'FIXED',
      amount: 300,
      applicableStore: 'ALL',
      applicableBrand: 'EXCLUDE',
      validDays: 90,
      createTime: '2024-05-03 14:00:00'
    },
    {
      id: 29,
      name: '草稿卡类型-待配置D',
      status: 0,
      amountMode: 'FIXED',
      amount: 500,
      applicableStore: 'SPECIFIC',
      applicableBrand: 'ALL',
      validDays: 730,
      createTime: '2024-05-04 11:20:00'
    },
    {
      id: 30,
      name: '草稿卡类型-待配置E',
      status: 0,
      amountMode: 'CUSTOM',
      applicableStore: 'ALL',
      applicableBrand: 'ALL',
      validDays: 365,
      createTime: '2024-05-05 16:45:00'
    },
    {
      id: 31,
      name: '草稿卡类型-待配置F',
      status: 0,
      amountMode: 'FIXED',
      amount: 200,
      applicableStore: 'ALL',
      applicableBrand: 'INCLUDE',
      validDays: 60,
      createTime: '2024-05-06 08:30:00'
    },
    {
      id: 32,
      name: '草稿卡类型-待配置G',
      status: 0,
      amountMode: 'FIXED',
      amount: 1000,
      applicableStore: 'SPECIFIC',
      applicableBrand: 'EXCLUDE',
      validDays: 1095,
      createTime: '2024-05-07 13:15:00'
    }
  ]

  // 根据名称筛选
  let filteredData = mockData
  if (params.name) {
    filteredData = mockData.filter(item => item.name.includes(params.name!))
  }

  // 分页
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = filteredData.slice(start, end)

  return {
    rows,
    total: filteredData.length,
    pageNum,
    pageSize,
    totalPage: Math.ceil(filteredData.length / pageSize)
  }
}

/** 获取储值卡类型列表 */
export const getGiftCardTemplateList = async (
  params: GiftCardTemplateListParams
): Promise<GiftCardTemplateListResponse> => {
  if (MOCK) {
    return {
      code: 200,
      msg: 'success',
      data: generateMockList(params)
    }
  }
  return post(`${BASE_URL}/list`, params)
}

/** 获取储值卡类型详情 */
export const getGiftCardTemplateDetail = async (
  id: number
): Promise<GiftCardTemplateDetailResponse> => {
  return get(`${BASE_URL}/getById/${id}`)
}

/** 保存或更新储值卡类型 */
export const saveOrUpdateGiftCardTemplate = async (
  data: SaveOrUpdateGiftCardTemplateRequest
): Promise<SaveOrUpdateResponse> => {
  if (MOCK) {
    return {
      code: 200,
      msg: 'success',
      warn: false,
      success: true,
      error: false,
      empty: false
    }
  }
  return post(`${BASE_URL}/saveOrUpdate`, data)
}

/** 删除储值卡类型 */
export const deleteGiftCardTemplate = async (id: number): Promise<DeleteResponse> => {
  return del(`${BASE_URL}/delete/${id}`)
}

/** 更新储值卡类型状态 */
export const updateGiftCardTemplateStatus = async (
  params: UpdateStatusRequest
): Promise<UpdateStatusResponse> => {
  return post(`${BASE_URL}/updateStatus`, params)
}

/** 查询可用于制卡的卡类型列表 */
export const listGiftCardTemplateForBatch = async (): Promise<ListForBatchResponse> => {
  return get(`${BASE_URL}/listForBatch`)
}
