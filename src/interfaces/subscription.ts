import type { AiChatbot } from './aichatbot'
import type { Hotel } from './property'

export interface Billing {
  id: number | null
  chatbot_id: number | null
  uuid: string
  paid_at: string
  name: string
  package_type: string
  sub_total: string
  sst: string
  total_payment: string
  payment_method: string
  payment_type: 'charge' | 'tokenize'
  status: string
  invoice_url: string
  receipt_url: string | null
  created_at: string
  updated_at: string
  payment_due_date: string
}

export interface BillingData {
  billings: Billing[]
  current_page: number
  last_page: number
}

export interface BillingHisResponse {
  status: string
  status_code: number
  msg: string
  data: BillingData
}

export interface BillingDetailResponse {
  status: string
  status_code: number
  msg: string
  data: BillingDetailData
}

export interface BillingDetailData {
  billing: Billing
}

export interface SubscriptionListResponse {
  status: string
  status_code: number
  msg: string
  data: SubscriptionsData
}

export interface SingleSubscriptionData {
  subscription: Subscription
}

export interface SubscriptionsData {
  subscriptions: Subscription[]
}

interface SubscriptionStatus {
  status: 'active' | 'inactive' | 'paused' | 'pending_activation' | 'pending_payment'
}

export interface SubscriptionDetails extends SubscriptionStatus {
  next_billing_at: string
  expired_at: string
  twoc2p_card_token: string
  twoc2p_card_no: string
  package_type: string
  is_trial: number
  is_paused: number
}

export interface BillingCharge {
  id: number
  merchant_id: number
  desc: string
  unit_price: string
  quantity: number
  total_price: string
  is_monthly: number
  created_at: string
  updated_at: string
}

export interface PackageDetail {
  sst: string
  sub_total: string
  total: string
  charge_at: string
}

export interface SubscriptionPackages {
  monthly: SubscriptionPackage
  yearly: SubscriptionPackage
}

export interface SubscriptionPackage {
  recurring: PackageDetail
  first_time: PackageDetail
}

export interface Subscription {
  id: number
  name: string
  subscription: SubscriptionDetails
  total_unit: number
  created_at: string
  updated_at: string
  billing_charges: BillingCharge[]
  subscription_package: SubscriptionPackage
}

export interface UnsubscribeResponse {
  status: string
  status_code: number
  msg: string
  data: SingleSubscriptionData
}

export interface SubscribeResponse {
  status: string
  status_code: number
  msg: string | null
  data: {
    payment_url: string
  }
}

export interface PlatformType {
  value: string
  label: string
  require_fields: RequireField[]
}

export interface RequireField {
  label: string
  sub_label: string
  key: string
  type: string
}

export interface PlatformTypeList {
  platform_types: PlatformType[]
}

export interface PlatformTypesResponse {
  status: string
  status_code: number
  msg: string | null
  data: PlatformTypeList
}

export interface ChatbotRequestResponse {
  status: string
  status_code: number
  msg: string | null
  data: ChatbotReqData
}

export interface ChatbotReqData {
  chatbot_setup_request: ChatbotSetupRequest
  ai_chatbot: AiChatbot
  hotel: Hotel
}

export interface ChatbotSetupRequest {
  user_id: number
  platform_type: string
  chatbot_name: string
  updated_at: string
  created_at: string
  id: number
  merchant_id: number
  system_platform_other: string | null
}

export interface GridOption {
  id: number
  price: string
  description: string
  note?: string
  billingItems?: BillingCharge[]
}

export interface PromoCodeResponse {
  status: string
  status_code: number
  msg: string | null
  data: PromoCodeData
}

export interface PromoCodeData {
  subscription: Subscription
}
