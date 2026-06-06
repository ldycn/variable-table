import { get, post } from '@/shared/utils/fetch'
import {
  mockAuditGiftCardProductionBatch,
  mockExportGiftCardProductionBatchCards,
  mockGetGiftCardProductionBatchDetail,
  mockListGiftCardProductionBatchByPage,
  mockQueryCardList,
  mockVoidGiftCardProductionBatch
} from '../../../mock/giftCardProductionBatch'

// ==================== 枚举类型定义 ====================

/** 单据状态：0-待审核、1-已审核、2-已作废 */
export type BatchStatus = 0 | 1 | 2

/** 卡状态: 0-待激活、1-已激活、2-已冻结、3-已作废、4-已过期 */
export type CardStatus = 0 | 1 | 2 | 3 | 4

/** 消费状态: 0-未使用、1-部分使用、2-使用完毕 */
export type ConsumeStatus = 0 | 1 | 2

/** 类别：0-储值卡、1-兑换券 */
export type Category = 0 | 1

/** 介质类型：0-磁条卡、1-IC卡、2-条码卡 */
export type MediaType = 0 | 1 | 2

// ==================== 枚举显示映射 ====================

export const BatchStatusEnum: Record<BatchStatus, string> = {
  0: '待审核',
  1: '已审核',
  2: '已作废'
}

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

export const MediaTypeEnum: Record<MediaType, string> = {
  0: '磁条卡',
  1: 'IC卡',
  2: '条码卡'
}

// ==================== 接口类型定义 ====================

/** 通用API响应类型 */
interface ApiResponse<T> {
  code: number
  msg?: string
  data?: T
}

/** 分页请求基础参数 */
export interface PageParams {
  pageNum?: number
  pageSize?: number
  orderByColumn?: string
  isAsc?: string
  reasonable?: boolean
  page?: boolean
}

/** 制卡单列表查询参数 */
export interface GiftCardProductionBatchListParams extends PageParams {
  /** 卡类型名称（精确匹配） */
  name?: string
  /** 储值卡类型（模板）ID */
  giftCardTemplateId?: number
  /** 卡介质: 0-磁条卡、1-IC卡、2-条码卡 */
  mediaType?: number
  /** 单据状态: 0-待审核、1-已审核、2-已作废 */
  status?: number
  /** 卡类型类别: 0-储值卡、1-兑换券 */
  category?: number
  /** 制单人ID */
  createId?: number
}

/** 制卡单列表项 */
export interface GiftCardProductionBatchListItem {
  /** 制卡单ID */
  id: number
  /** 制卡单编号 */
  code: string
  /** 卡类型名称 */
  templateName: string
  /** 卡介质: 0-磁条卡、1-IC卡、2-条码卡 */
  mediaType: number
  /** 面额 */
  amount: number
  /** 制卡数量 */
  quantity: number
  /** 起始卡号 */
  startNo: string
  /** 结束卡号 */
  endNo: string
  /** 卡号前缀 */
  codePrefix: string
  /** 单据状态: 0-待审核、1-已审核、2-作废 */
  status: number
  /** 待激活数量 */
  inactiveCount: number
  /** 已激活数量 */
  activeCount: number
  /** 创建时间 */
  createTime: string
  /** 制卡人 */
  createBy: string
}

/** 分页响应数据 */
export interface PageData<T> {
  rows: T[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}

/** 制卡单列表响应 */
export type GiftCardProductionBatchListResponse = ApiResponse<
  PageData<GiftCardProductionBatchListItem>
>

/** 面额类型：0-固定面额、1-预置面额、2-自定义面额 */
export type AmountMode = 0 | 1 | 2

/** 面额类型枚举显示映射 */
export const AmountModeEnum: Record<AmountMode, string> = {
  0: '固定面额',
  1: '预置面额',
  2: '自定义面额'
}

/** 制卡单详情 */
export interface GiftCardProductionBatchDetail {
  /** 制卡单编号 */
  code: string
  /** 单据状态: 0-待审核、1-已审核、2-作废) */
  status: number
  /** 制卡人 */
  createBy: string
  /** 制卡人名称 */
  createUserName?: string
  /** 制卡时间 */
  createTime: string
  /** 审核人 */
  auditor: string
  /** 审核时间 */
  auditTime: string
  /** 面额 */
  amount: number
  /** 制卡数量 */
  quantity: number
  /** 卡号前缀 */
  codePrefix: string
  /** 起始卡号 */
  startNo: string
  /** 结束卡号 */
  endNo: string
  /** 有效期天数 */
  validDays: number
  /** 适用门店（逗号分隔） */
  applicableStores: string
  /** 适用品牌（逗号分隔） */
  applicableBrands: string
  /** 备注 */
  remark: string
  /** 储值卡类型名称 */
  templateName?: string
  /** 面额类型: 0-固定面额、1-预置面额、2-自定义面额 */
  amountMode?: number
  /** 类别: 0-储值卡、1-兑换券 */
  category?: number
  /** 介质类型: 0-磁条卡、1-IC卡、2-条码卡 */
  mediaType?: number
  /** 折扣 */
  discount?: string
  /** 消费密码方式 */
  passwordMode?: string
  /** 待激活数量 */
  inactiveCount?: number
  /** 号段生成方式 */
  codeGenMode?: string
}

/** 制卡单详情响应 */
export type GiftCardProductionBatchDetailResponse = ApiResponse<GiftCardProductionBatchDetail>

/** 制卡单卡片明细查询参数 */
export interface QueryCardListParams extends PageParams {
  /** 制卡单ID */
  batchId: number
  /** 卡状态: 0-待激活、1-已激活、2-已冻结、3-已作废、4-已过期 */
  status?: number
}

/** 制卡单卡片明细项 */
export interface QueryCardListItem {
  /** 卡ID */
  id: number
  /** 卡号 */
  code: string
  /** 卡密 */
  pin: string
  /** 卡状态: 0-待激活、1-已激活、2-已冻结、3-已作废、4-已过期 */
  status: number
  /** 消费状态: 0-未使用、1-部分使用、2-使用完毕 */
  consumeStatus: number
  /** 面额 */
  amount: number
  /** 余额 */
  balance: number
}

/** 制卡单卡片明细响应 */
export type QueryCardListResponse = ApiResponse<PageData<QueryCardListItem>>

/** 创建制卡单请求参数 */
export interface CreateGiftCardProductionBatchParams {
  /** 储值卡模板ID */
  giftCardTemplateId: number
  /** 面额 */
  amount: number
  /** 卡号前缀（最多8位） */
  codePrefix?: string
  /** 制卡数量（1-10000） */
  quantity: number
  /** 起始卡号（纯数字） */
  startNo: string
  /** 结束卡号（纯数字） */
  endNo: string
  /** 有效期天数（1-3650） */
  validDays: number
  /** 备注 */
  remark?: string
}

/** 操作响应 */
export interface OperationResponse {
  warn: boolean
  msg: string
  code: number
  success: boolean
  error: boolean
  empty: boolean
}

// ==================== API 接口 ====================

const BASE_URL = '/miss-member/giftCardProductionBatch'

// 使用 mock 数据开关
const USE_MOCK = false

/** 分页查询制卡单列表 */
export const listGiftCardProductionBatchByPage = async (
  params: GiftCardProductionBatchListParams
): Promise<GiftCardProductionBatchListResponse> => {
  if (USE_MOCK) {
    const result = mockListGiftCardProductionBatchByPage({
      pageNum: params.pageNum || 1,
      pageSize: params.pageSize || 20,
      name: params.name,
      giftCardTemplateId: params.giftCardTemplateId,
      mediaType: params.mediaType,
      status: params.status,
      category: params.category
    })
    return Promise.resolve(result as unknown as GiftCardProductionBatchListResponse)
  }
  return post(`${BASE_URL}/listByPage`, params)
}

/** 查询制卡单详情 */
export const getGiftCardProductionBatchDetail = async (
  id: number
): Promise<GiftCardProductionBatchDetailResponse> => {
  if (USE_MOCK) {
    const result = mockGetGiftCardProductionBatchDetail(id)
    return Promise.resolve(result as unknown as GiftCardProductionBatchDetailResponse)
  }
  return get(`${BASE_URL}/detail/${id}`)
}

/** 查询制卡单卡明细 */
export const queryCardList = async (
  params: QueryCardListParams
): Promise<QueryCardListResponse> => {
  if (USE_MOCK) {
    const result = mockQueryCardList({
      batchId: params.batchId,
      pageNum: params.pageNum || 1,
      pageSize: params.pageSize || 20,
      status: params.status
    })
    return Promise.resolve(result as unknown as QueryCardListResponse)
  }
  return post(`${BASE_URL}/cardList`, params)
}

/** 创建制卡单 */
export const createGiftCardProductionBatch = async (
  params: CreateGiftCardProductionBatchParams
): Promise<OperationResponse> => {
  return post(`${BASE_URL}/create`, params)
}

/** 审核制卡单 */
export const auditGiftCardProductionBatch = async (id: number): Promise<OperationResponse> => {
  if (USE_MOCK) {
    const result = mockAuditGiftCardProductionBatch(id)
    return Promise.resolve(result as unknown as OperationResponse)
  }
  return post(`${BASE_URL}/audit/${id}`)
}

/** 作废制卡单 */
export const voidGiftCardProductionBatch = async (id: number): Promise<OperationResponse> => {
  if (USE_MOCK) {
    const result = mockVoidGiftCardProductionBatch(id)
    return Promise.resolve(result as unknown as OperationResponse)
  }
  return post(`${BASE_URL}/void/${id}`)
}

/** 导出制卡单卡片CSV */
export const exportGiftCardProductionBatchCards = async (id: number): Promise<Response> => {
  if (USE_MOCK) {
    const result = mockExportGiftCardProductionBatchCards(id)
    return new Response(new Blob([result.data], { type: 'text/csv' }))
  }
  return get(`${BASE_URL}/exportCards/${id}`)
}
