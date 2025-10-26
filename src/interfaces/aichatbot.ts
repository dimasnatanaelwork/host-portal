import type { Hotel } from './property'
import type { BillingCharge, SubscriptionDetails, SubscriptionPackages } from './subscription'

export interface AiChatbotListResponse {
  status: string
  status_code: number
  msg: string | null
  data: AiChatbotListData
}

export interface AiChatbotListData {
  ai_chatbots: AiChatbot[]
}

export interface AiChatbot {
  id: number
  name: string
  openai_persona: string
  openai_model: string
  openai_temperature: string
  evolution_instance_mobile: string
  evolution_instance_name: string
  evolution_instance_id: string
  evolution_instance_state: string
  openai_merchant_info: OpenAiMerchantInfo
  evolution_intgration_type: string
  evolution_waba_token: string | null
  waba_id: string | null
  chatwoot_account_id: string
  chatwoot_token: string
  chatwoot_url: string
  forward_message_to: string
  forward_message_condition: string
  forward_message_response: string
  subscription: SubscriptionDetails
  subscription_packages: SubscriptionPackages
  isms: IsmsConfig
  created_at: string
  updated_at: string
  ai_docs: AiDoc[]
  billing_charges: BillingCharge[]
  yearly_billing_charges: BillingCharge[]
  query_room_rate: number
}

export interface OpenAiMerchantInfo {
  [key: string]: string
}

interface IsmsConfig {
  username: string | null
  isms_password: string | null
  isms_sendid: string | null
}

export interface AiChatbotDetailResponse {
  status: string
  status_code: number
  msg: string | null
  data: AiChatbotDetailData
}

export interface AiChatbotUpdateResponse {
  status: string
  status_code: number
  msg: string | null
  data: {
    ai_chatbot: AiChatbot
  }
}

export interface AiChatbotDetailData {
  ai_chatbot: AiChatbot
  hotels: HotelSummary[]
  forward_rules: ForwardRule[]
}

export interface AiChatbotHotel {
  id: number
  hotel_id: string
  hotel_name: string
  address: string
  mobile_number: string
  email: string
  latitude: string
  longtitude: string
  hotel_link: string | null
  check_in_time: string
  ttlock_username: string | null
  ttlock_password: string | null
  host_mobile_no: string | null
  send_to_host: number
  check_out_time: string
  need_landing_page: number
  wabot_instance_id: string | null
  wabot_access_token: string | null
  openai_persona: string | null
  forward_message_to: string | null
  forward_message_condition: string | null
  forward_message_response: string | null
  janus_wa_token: string
  locale: string
  boardcast_channel: string
  hp_access_token: string | null
  slug: string
  evolution_instance_mobile: string | null
  evolution_instance_name: string | null
  evolution_instance_id: string | null
  evolution_instance_state: string | null
  openai_hotel_info: any[] | null // Replace 'any' with a specific type if known
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface HotelSummary {
  id: number
  hotel_name: string
  mobile_number: string
  email: string
  check_in_time: string
  check_out_time: string
  address: string
  latitude: string
  longtitude: string
  hotel_link: string | null
  host_mobile_no: string | null
  send_to_host: number
  total_units: number
  created_at: string
  updated_at: string
}

export interface AiDoc {
  doc_url: string
  id: number
  name: string
  persona: string
}

export interface AiDocDetailResponse {
  status: string
  status_code: number
  msg: string | null
  data: {
    ai_doc: AiDoc
  }
}

export interface GenerateEvoQrResponse {
  status: string
  status_code: number
  msg: string | null
  data: GeneratedQRData
}

export interface GetEvoQrStatusResponse {
  status: string
  status_code: number
  msg: string | null
  data: EvoQrStatusData
}

export interface EvoQrStatusData {
  state: 'open' | 'connecting' | null
}

export interface GeneratedQRData {
  merchant: Merchant
  qrcode: QrCode
}

export interface Merchant {
  id: number
  payment_user_id: number
  is_official: number
  name: string
  wabot_instance_id: string | null
  wabot_access_token: string | null
  bukku_access_token: string | null
  bukku_subdomain: string | null
  openai_persona: string | null
  recommend_openai_persona: string | null
  query_room_rate: number
  need_ai_suggest: number
  recommend_openai_updated_at: string | null
  total_first_charges: string
  total_yearly_first_charges: string
  total_yearly_charges: string
  total_monthly_charges: string
  openai_model: string
  fine_tuned_model: string
  free_days: number
  collect_passport_id: number
  issue_invoice: number
  store_carplate: number
  openai_temperature: string
  evolution_instance_mobile: string
  evolution_instance_name: string
  evolution_instance_id: string
  evolution_instance_state: string
  openai_merchant_info: any[] // empty array, type unknown
  openai_image_recognition: number
  chat_type: string
  use_openai_assistant: number
  openai_assistant_id: string | null
  vector_store_id: string | null
  notify_mobile_no: string | null
  evolution_intgration_type: string
  evolution_waba_token: string | null
  waba_id: string | null
  chatwoot_account_id: string | null
  chatwoot_token: string | null
  chatwoot_url: string | null
  use_file_search: number
  store_image: number
  including_lead_info: number
  ai_start_command: string
  ai_stop_command: string
  is_support_careplus: number
  careplus_member_access_token: string | null
  careplus_merchant_access_token: string | null
  openai_audio_recognition: number
  forward_message_to: string
  forward_message_condition: string
  forward_message_response: string
  webchat_active: number
  webchat_maincolor: string
  webchat_msgcolor: string
  webchat_logo: string
  webchat_maintitle_active: number
  webchat_maintitle: string
  webchat_introduction: string | null
  webchat_sub_introduction: string | null
  call_to_actions: string | null
  webchat_sound: number
  webchat_textcolor: string
  subscription_expired_at: string // ISO date string
  subscription_status: string
  unsubscribed_at: string // ISO date string
  isms_username: string
  isms_password: string
  isms_sendid: string
  first_payment: number
  is_paused: number
  twoc2p_card_token: string
  twoc2p_card_no: string
  package_type: string
  deleted_at: string | null
  created_at: string // ISO date string
  updated_at: string // ISO date string
  is_chat_gpt5: boolean
  hotel: Hotel
}

export interface QrCode {
  pairingCode: string | null
  code: string
  base64: string
  count: number
}
export interface ForwardRuleResponse {
  status: string
  status_code: number
  msg: string | null
  data: ForwardRuleData
}

export interface ForwardRuleData {
  forward_rule: ForwardRule
}

export interface ForwardRule {
  id: number
  title: string
  forward_message_to: string
  function_instruction: string
  forward_message_response: string
  params: ForwardRuleParam[]
  is_enable: number
  created_at: string
}

interface ForwardRuleParam {
  param_name: string
  type: string
  description: string
  is_required: number
}
