import { get, post } from '@/shared/utils/fetch'
import {
  mockAddGiftCardSell,
  mockEditGiftCardSell,
  mockGetGiftCardSellCards,
  mockGetGiftCardSellDetail,
  mockGetGiftCardSellPage,
  mockGetGiftCardStores,
  mockReceiptGiftCardSell,
  mockValidGiftCardSell
} from '../../../mock/giftCardSell'

const BASE_URL = '/miss-member/giftCardSellWeb'
const USE_MOCK = false

export type OrderStatus = 0 | 1
export type PayStatus = 0 | 1
export type PayType = 0 | 1 | 2 | 3 | 4
export type ActivateStatus = 0 | 1 | 2

export const OrderStatusEnum: Record<OrderStatus, string> = {
  0: '正常',
  1: '已作废'
}

export const PayStatusEnum: Record<PayStatus, string> = {
  0: '未收款',
  1: '已收款'
}

export const PayTypeEnum: Record<PayType, string> = {
  0: '银行转账',
  1: '扫码支付',
  2: '账期',
  3: '信用额度',
  4: '现金'
}

export const ActivateStatusEnum: Record<ActivateStatus, string> = {
  0: '未激活',
  1: '已激活',
  2: '部分激活'
}

export const OrderStatusOptions = Object.entries(OrderStatusEnum).map(([value, label]) => ({
  value: Number(value) as OrderStatus,
  label
}))

export const PayStatusOptions = Object.entries(PayStatusEnum).map(([value, label]) => ({
  value: Number(value) as PayStatus,
  label
}))

export const PayTypeOptions = Object.entries(PayTypeEnum).map(([value, label]) => ({
  value: Number(value) as PayType,
  label
}))

export const ActivateStatusOptions = Object.entries(ActivateStatusEnum).map(([value, label]) => ({
  value: Number(value) as ActivateStatus,
  label
}))

// ==================== 可添加卡列表 ====================

export interface AddableCardsParams {
  pageNum?: number
  pageSize?: number
  orderByColumn?: string
  isAsc?: string
  reasonable?: boolean
  code?: string
  category?: number
  page?: boolean
  status?: number
  excludeIds?: number[]
  orderId?: number,
  sellId?: number
}

export interface AddableCardsRow {
  id: number
  code: string
  templateName: string
  category: number
  amount: number
  balance: number
  status: number
  mediaType: number
  amountMode: number
  validDays: number
  createUserCode: string
  createUserName: string
  createNickName: string
  createTime: Record<string, unknown>
}

export interface AddableCardsData {
  rows: AddableCardsRow[]
  code: number
  msg: string
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}

export interface AddableCardsRes {
  code: number
  msg: string
  data: AddableCardsData
}

// ==================== 分页查询 ====================

export interface GiftCardSellPageParams {
  pageNum?: number
  pageSize?: number
  orderByColumn?: string
  isAsc?: string
  reasonable?: boolean
  code?: string
  storeId?: number
  createId?: number
  status?: OrderStatus
  payStatus?: PayStatus
  activateStatus?: ActivateStatus
  startTime?: string
  endTime?: string
  startDate?: string
  endDate?: string
  page?: boolean
}

export interface GiftCardSellPageItem {
  id: number
  code: string
  type: number
  customer: string
  customerName?: string
  storeId: number
  equipmentId: number | null
  amount: number
  payAmount: number
  payStatus: PayStatus
  status: OrderStatus
  activateStatus?: ActivateStatus
  payTime: string | null
  payType: PayType
  createId: number
  createTime: string
  updateId: number
  updateTime: string
  remark: string
  payRemark: string
  storeCode: string
  storeName: string
  createUserCode: string
  createUserName: string
  createNickName: string
  updateUserCode: string
  updateUserName: string
  updateNickName: string
}

export interface GiftCardSellPageData {
  rows: GiftCardSellPageItem[]
  code: number
  msg: string
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}

export interface GiftCardSellPageResponse {
  code: number
  msg: string
  data: GiftCardSellPageData
}

// ==================== 详情-基本信息 ====================

export interface GiftCardSellDetailBase {
  id: number
  code: string
  type: number
  customer: string
  customerId?: number
  customerName?: string
  customerCode?: string
  customerContact?: string
  customerPhone?: string
  storeId: number
  equipmentId: number | null
  amount: number
  payAmount: number
  payStatus: PayStatus
  status: OrderStatus
  activateStatus?: ActivateStatus
  payTime: string | null
  payType: PayType
  createId: number
  createTime: string
  updateId: number
  updateTime: string
  remark: string
  payRemark: string
  storeCode: string
  storeName: string
  createUserCode: string
  createUserName: string
  createNickName: string
  updateUserCode: string
  updateUserName: string
  updateNickName: string
  auditId?: number
  auditTime?: string
  auditUserCode?: string
  auditUserName?: string
  auditNickName?: string
  documentUrls: Array<{ url: string } | string>
}

export interface GiftCardSellDetailBaseResponse {
  code: number
  msg: string
  data: GiftCardSellDetailBase
}

// ==================== 详情-卡分页列表 ====================

export interface GiftCardSellDetailCardsParams {
  id: number
  pageNum?: number
  pageSize?: number
  orderByColumn?: string
  isAsc?: string
  reasonable?: boolean
  page?: boolean
}

export interface GiftCardSellDetailCardItem {
  cardId?: number
  cardCode: string
  cardTypeName: string
  cardStatus: string
  cardConsumeStatus: string
  validDays: number
  amount: number
  balance: number
  remark: string
  groupPurchaseBatch?: string
  mediaType?: number
  category?: number
  amountMode?: number
  templateName?: string
}

export interface GiftCardSellDetailCardsData {
  rows: GiftCardSellDetailCardItem[]
  code: number
  msg: string
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}

export interface GiftCardSellDetailCardsResponse {
  code: number
  msg: string
  data: GiftCardSellDetailCardsData
}

// ==================== 新增售卡单 ====================

export interface GiftCardSellCardItem {
  cardId: number
  remark?: string
}

export interface GiftCardSellAddParams {
  storeId: number
  customer: string
  payType: PayType
  amount?: number
  remark?: string
  cards?: GiftCardSellCardItem[]
}

export interface GiftCardSellAddResponse {
  code: number
  msg: string
  data: Record<string, unknown>
}

// ==================== 修改售卡单-基本信息 ====================

export interface GiftCardSellEditParams {
  id: number
  storeId: number
  customer: string
  payType: PayType
  amount?: number
  remark?: string
  cards?: GiftCardSellCardItem[]
}

export interface GiftCardSellEditResponse {
  code: number
  msg: string
  data: Record<string, unknown>
}

// ==================== 修改售卡单-批量添加卡 ====================

export interface GiftCardSellAddCardsParams {
  id: number
  cards?: GiftCardSellCardItem[]
}

export interface GiftCardSellAddCardsResponse {
  code: number
  msg: string
  data: Record<string, unknown>
}

// ==================== 作废售卡单 ====================

export interface GiftCardSellValidResponse {
  code: number
  msg: string
  data: Record<string, unknown>
}

// ==================== 收款 ====================

export interface GiftCardSellReceiptParams {
  id: number
  payTime: string
  payAmount: number
  payType: PayType
  documentUrls?: { name: string; url: string }[]
  remark?: string
}

export interface GiftCardSellReceiptResponse {
  code: number
  msg: string
  data: Record<string, unknown>
}

// ==================== API 函数 ====================

/**
 * 分页查询
 */
export const getGiftCardSellPage = async (
  params: GiftCardSellPageParams
): Promise<GiftCardSellPageResponse> => {
  if (USE_MOCK) {
    return mockGetGiftCardSellPage(params) as Promise<GiftCardSellPageResponse>
  }
  return post(BASE_URL + '/page', params)
}

/**
 * 详情-基本信息
 */
export const getGiftCardSellDetailBase = async (
  id: number
): Promise<GiftCardSellDetailBaseResponse> => {
  if (USE_MOCK) {
    return mockGetGiftCardSellDetail(id) as Promise<GiftCardSellDetailBaseResponse>
  }
  return get(BASE_URL + '/detail-base', { id })
}

/**
 * 详情-卡分页列表
 */
export const getGiftCardSellDetailCards = async (
  params: GiftCardSellDetailCardsParams
): Promise<GiftCardSellDetailCardsResponse> => {
  if (USE_MOCK) {
    return mockGetGiftCardSellCards(params) as Promise<GiftCardSellDetailCardsResponse>
  }
  return post(BASE_URL + '/detail-cards', params)
}

/**
 * 新增售卡单
 */
export const addGiftCardSell = async (
  params: GiftCardSellAddParams
): Promise<GiftCardSellAddResponse> => {
  if (USE_MOCK) {
    return mockAddGiftCardSell(params) as Promise<GiftCardSellAddResponse>
  }
  return post(BASE_URL + '/add', params)
}

/**
 * 修改售卡单-基本信息
 */
export const editGiftCardSell = async (
  params: GiftCardSellEditParams
): Promise<GiftCardSellEditResponse> => {
  if (USE_MOCK) {
    return mockEditGiftCardSell(params) as Promise<GiftCardSellEditResponse>
  }
  return post(BASE_URL + '/edit-base', params)
}

/**
 * 修改售卡单-批量添加卡
 */
export const addCardsGiftCardSell = async (
  params: GiftCardSellAddCardsParams
): Promise<GiftCardSellAddCardsResponse> => {
  if (USE_MOCK) {
    return { code: 200, msg: '添加成功', data: {} }
  }
  return post(BASE_URL + '/add-cards', params)
}

/**
 * 作废售卡单
 */
export const validGiftCardSell = async (id: number): Promise<GiftCardSellValidResponse> => {
  if (USE_MOCK) {
    return mockValidGiftCardSell(id) as Promise<GiftCardSellValidResponse>
  }
  return post(BASE_URL + '/valid', { id })
}

/**
 * 收款
 */
export const receiptGiftCardSell = async (
  params: GiftCardSellReceiptParams
): Promise<GiftCardSellReceiptResponse> => {
  if (USE_MOCK) {
    return mockReceiptGiftCardSell(params) as Promise<GiftCardSellReceiptResponse>
  }
  return post(BASE_URL + '/receipt', params)
}

/**
 * 分页查询可添加卡列表
 */
export const addableCards = async (params: AddableCardsParams): Promise<AddableCardsRes> => {
  return post(BASE_URL + '/addable-cards', params)
}

/**
 * 回收单分页查询可添加卡列表
 */

export const recycleAddableCards = async (params: AddableCardsParams): Promise<AddableCardsRes> => {
  return post('/miss-member/giftCardRecycle/addable-cards', params)
}

// ==================== 兼容旧接口（保持向后兼容） ====================

/**
 * @deprecated 请使用 getGiftCardSellPage
 */
export const getGiftCardSellList = getGiftCardSellPage

/**
 * @deprecated 请使用 getGiftCardSellDetailBase
 */
export const getGiftCardSellDetail = getGiftCardSellDetailBase

/**
 * @deprecated 请使用 addGiftCardSell
 */
export const createGiftCardSell = addGiftCardSell

/**
 * @deprecated 请使用 editGiftCardSell
 */
export const updateGiftCardSell = editGiftCardSell

/**
 * @deprecated 请使用 validGiftCardSell
 */
export const invalidGiftCardSell = validGiftCardSell

/**
 * @deprecated 请使用 receiptGiftCardSell
 */
export const payGiftCardSell = receiptGiftCardSell

// ==================== 门店相关 ====================

export interface GiftCardStore {
  id: number
  name: string
  code?: string
}

export interface GiftCardStoreResponse {
  code: number
  msg: string
  data: GiftCardStore[]
}

/**
 * 获取门店列表
 */
export const getGiftCardStores = async (): Promise<GiftCardStoreResponse> => {
  if (USE_MOCK) {
    return mockGetGiftCardStores() as Promise<GiftCardStoreResponse>
  }
  return get('/miss-goods/store/getStoreBystoreCodeAndName', { pageNum: 1, pageSize: 1000 })
}

// ==================== 兼容旧类型定义（保持向后兼容） ====================

/** @deprecated 请使用 GiftCardSellPageParams */
export type GiftCardSellListParams = GiftCardSellPageParams

/** @deprecated 请使用 GiftCardSellPageItem */
export type GiftCardSellListItem = GiftCardSellPageItem

/** @deprecated 请使用 GiftCardSellPageData */
export type GiftCardSellListData = GiftCardSellPageData

/** @deprecated 请使用 GiftCardSellPageResponse */
export type GiftCardSellListResponse = GiftCardSellPageResponse

/** @deprecated 请使用 GiftCardSellDetailBase */
export type GiftCardSellDetail = GiftCardSellDetailBase

/** @deprecated 请使用 GiftCardSellDetailBaseResponse */
export type GiftCardSellDetailResponse = GiftCardSellDetailBaseResponse
