import { get, post, put } from '@/shared/utils/fetch'

// ==================== 枚举类型定义 ====================

/** 卡状态：0-待激活、1-已激活、2-已冻结、3-已作废、4-已过期 */
export type CardStatus = 0 | 1 | 2 | 3 | 4

/** 消费状态：0-未使用、1-部分使用、2-使用完毕 */
export type ConsumeStatus = 0 | 1 | 2

/** 类别：0-储值卡、1-兑换券 */
export type Category = 0 | 1

/** 面值模式：0-固定面值、1-自定义面值 */
export type AmountMode = 0 | 1

/** 介质类型：0-磁条卡 */
export type MediaType = 0

/** 消费记录类型：0-消费、1-退款 */
export type ConsumeLogType = 0 | 1

// ==================== 枚举显示映射 ====================

export const CardStatusEnum: Record<CardStatus, string> = {
  0: '待激活',
  1: '已激活',
  2: '已冻结',
  3: '已作废',
  4: '已过期'
}

export const ConsumeStatusEnum: Record<ConsumeStatus, string> = {
  0: '未使用',
  1: '部分使用',
  2: '使用完毕'
}

export const CategoryEnum: Record<Category, string> = {
  0: '储值卡',
  1: '兑换券'
}

export const AmountModeEnum: Record<AmountMode, string> = {
  0: '固定面值',
  1: '自定义面值'
}

export const MediaTypeEnum: Record<MediaType, string> = {
  0: '磁条卡'
}

export const ConsumeLogTypeEnum: Record<ConsumeLogType, string> = {
  0: '消费',
  1: '退款'
}

// ==================== 接口类型定义 ====================

/** 通用API响应类型 */
interface ApiResponse<T> {
  code: number
  msg?: string
  data?: T
}

/** 储值卡明细列表查询参数 */
export interface GiftCardListParams {
  pageNum: number
  pageSize: number
  code?: string
  giftCardTemplateId?: number
  status?: CardStatus
  /** 制卡单编号 */
  giftCardProductionBatchCode?: string
  /** 创建时间开始 */
  createTimeStart?: string
  /** 创建时间结束 */
  createTimeEnd?: string
}

/** 储值卡明细列表项 */
export interface GiftCardListItem {
  id: number
  giftCardTemplateId: number
  giftCardProductionBatchId: number
  name: string
  code: string
  status: CardStatus
  consumeStatus: ConsumeStatus | null
  category: Category
  amountMode: AmountMode
  mediaType: MediaType
  amount: number
  balance: number
  cardActivationStore: number | null
  activateDate: string | null
  effectiveDeadlineDate: string | null
  cardProductionDate: string
  salesDate: string | null
  /** 制卡单编号 */
  giftCardProductionBatchCode: string
  templateName: string
  /** 创建人ID */
  createId: number
  /** 创建人名称 */
  createUserName: string
  /** 创建人编码 */
  createUserCode: string
  createTime: string
  updateId: string | null
  updateTime: string | null
  remark: string
}

/** 储值卡明细列表响应数据 */
export interface GiftCardListData {
  rows: GiftCardListItem[]
  total: number
}

/** 储值卡明细列表响应 */
export type GiftCardListResponse = ApiResponse<GiftCardListData>

/** 模板信息 */
export interface TemplateInfo {
  id: number
  name: string
  category: Category
  amountMode: AmountMode
  validDays: number
  applicableBrand: number
  applicableStore: number
}

/** 消费记录 */
export interface ConsumeLog {
  id: number
  storeId: number
  storeName: string
  type: ConsumeLogType
  businessId: string
  amount: number
  beforeBalance: number
  afterBalance: number
  createTime: string
}

/** 操作日志 */
export interface OperationLog {
  id: number
  type: string
  detail: string
  balance: number
  createId: string
  createTime: string
}

/** 储值卡明细详情 */
export interface GiftCardDetail {
  id: number
  giftCardTemplateId: number
  giftCardProductionBatchId: number
  name: string
  code: string
  status: CardStatus
  consumeStatus: ConsumeStatus | null
  category: Category
  amountMode: AmountMode
  mediaType: MediaType
  amount: number
  balance: number
  cardActivationStore: number | null
  cardActivationStoreName: string | null
  activateDate: string | null
  effectiveDeadlineDate: string | null
  cardProductionDate: string
  salesDate: string | null
  batchCode: string
  templateName: string
  templateInfo: TemplateInfo
  consumeLogs: ConsumeLog[]
  operationLogs: OperationLog[]
  createId: string
  createTime: string
  updateId: string | null
  updateTime: string | null
  remark: string
}

/** 储值卡明细详情响应 */
export type GiftCardDetailResponse = ApiResponse<GiftCardDetail>

/** 批量导入失败详情 */
export interface ImportFailDetail {
  row: number
  cardCode: string
  reason: string
}

/** 批量导入结果 */
export interface ImportResult {
  successCount: number
  failCount: number
  failDetails: ImportFailDetail[]
}

/** 批量导入响应 */
export type ImportResponse = ApiResponse<ImportResult>

/** 操作响应 */
export interface OperationResponse {
  code: number
  msg?: string
}

// ==================== API 接口 ====================

const BASE_URL = '/api/gift-cards'

/** 获取储值卡明细列表 */
export const getGiftCardList = async (
  params: GiftCardListParams
): Promise<GiftCardListResponse> => {
  return get(BASE_URL, { params })
}

/** 获取储值卡明细详情 */
export const getGiftCardDetail = async (id: number): Promise<GiftCardDetailResponse> => {
  return get(`${BASE_URL}/${id}`)
}

/** 批量导入储值卡 */
export const importGiftCards = async (file: File): Promise<ImportResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  return post(`${BASE_URL}/import`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/** 激活储值卡 */
export const activateGiftCard = async (id: number): Promise<OperationResponse> => {
  return put(`${BASE_URL}/${id}/activate`)
}

/** 冻结储值卡 */
export const freezeGiftCard = async (id: number): Promise<OperationResponse> => {
  return put(`${BASE_URL}/${id}/freeze`)
}

/** 解冻储值卡 */
export const unfreezeGiftCard = async (id: number): Promise<OperationResponse> => {
  return put(`${BASE_URL}/${id}/unfreeze`)
}

/** 作废储值卡 */
export const invalidGiftCard = async (id: number): Promise<OperationResponse> => {
  return put(`${BASE_URL}/${id}/invalid`)
}

// ==================== listByPage_2 接口（用于储值卡回收单选择） ====================

export interface ListByPage_2Params {
  pageNum?: number
  pageSize?: number
  orderByColumn?: string
  isAsc?: string
  reasonable?: boolean
  code?: string
  category?: number
  status?: number
  giftCardTemplateId?: number
  giftCardProductionBatchCode?: string
  createTimeStart?: Record<string, unknown>
  createTimeEnd?: Record<string, unknown>
  page?: boolean
}

export interface ListByPage_2Row {
  id: number
  code: string
  giftCardProductionBatchCode: string
  templateName: string
  category: number
  amount: number
  balance: number
  status: number
  consumeStatus: number
  mediaType: MediaType
  amountMode: AmountMode
  validDays: number
  createBy: number
  createUserName: string
  createUserCode: string
  createTime: Record<string, unknown>
  effectiveDeadlineDate: Record<string, unknown>
}

export interface ListByPage_2Data {
  rows: ListByPage_2Row[]
  code: number
  msg: string
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}

export interface ListByPage_2Res {
  code: number
  msg: string
  data: ListByPage_2Data
}

export const listByPage_2 = async (params: ListByPage_2Params): Promise<ListByPage_2Res> => {
  return post('/miss-member/giftCard/listByPage', params)
}

export const shellCards = async (params) => {
  return post('/miss-member/giftCardSellWeb/addable-cards', params)
}
