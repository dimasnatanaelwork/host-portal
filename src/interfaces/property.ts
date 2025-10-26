import type { LabelValueOption } from './general_interface'

export interface Hotel {
  id: number
  hotel_name: string
  mobile_number: string
  email: string
  check_in_time: string
  check_out_time: string
  address: string
  latitude: string
  longtitude: string
  hotel_link: string
  host_mobile_no: string
  send_to_host: number
  boardcast_channel: string
  total_units: number
  created_at: string
  updated_at: string
  hotel_id: string
  hp_external_property_id: string | null
  hp_access_token: string
  ezee_auth_code: string | null
  ezee_hotel_code: string | null
  hostaway_acc_secret: string | null
  system_platform: string
  is_pms_intergrated: number
}

export interface PropertyListData {
  hotels: Hotel[]
}

export interface PropertyListResponse {
  status: string
  status_code: number
  msg: string | null
  data: PropertyListData
}

export interface MessageType {
  type: string
  label: string
}

export interface ScheduleMessage {
  id: number
  title: string
  message_type: MessageType
  send_at: string | null
  content: string
  send_checkin_instruction: number
  doc_url: string
  handle_late_booking: number
  need_track_review: number
  sources: string[]
  platforms: string[]
  wa_status: string
  boardcast_channel: string
  meta_info: MetaInfo
  created_at: string
  updated_at: string
}

export interface MetaInfo {
  template_name: string
  template_id: string
  template_status: string
  template_category: string
  template_msg: string
}

export interface HotelRoom {
  id: number
  room_number: string
  securitybox_password: string
  openai_persona: string
  remark: string
  checkin_instruction_doc_url: string
  created_at: string
  updated_at: string
}

export interface OpenAIMerchantInfo {
  [key: string]: string // e.g. "Hotel Name": string, "Language": string, etc.
}

export interface AiDoc {
  id: number
  name: string
  persona: string
  doc_url: string
}

export interface PropertyDetailData {
  hotel: Hotel
  schedule_messages: ScheduleMessage[]
  hotel_rooms: HotelRoom[]
}

export interface PropertyDetailResponse {
  status: string
  status_code: number
  msg: string | null
  data: PropertyDetailData
}

export interface PropertyResponse {
  status: string
  status_code: number
  msg: string | null
  data: {
    hotel: Hotel
  }
}

export interface ScheduledMessageResponse {
  status: string
  status_code: number
  msg: string | null
  data: {
    scheduleMessage: ScheduleMessage
  }
}

export interface ScheduledMessageListResponse {
  status: string
  status_code: number
  msg: string | null
  data: {
    messages: ScheduleMessage[]
  }
}

export interface NoDataResponse {
  status: string
  status_code: number
  msg: string | null
  data: []
}

export interface HotelRoomResponse {
  status: string
  status_code: number
  msg: string | null
  data: {
    hotel_room: HotelRoom
  }
}

export interface ScheduledMessageTypesResponse {
  status: string
  status_code: number
  msg: string | null
  data: MessageTypesData
}

export interface MessageTypesData {
  schedule_messsage_types: LabelValueOption[]
}
