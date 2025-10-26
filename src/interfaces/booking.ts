import type { LabelValueOption } from './general_interface'
import type { Hotel, ScheduleMessage } from './property'

export interface BookingsResponse {
  status: string
  status_code: number
  msg: string | null
  data: BookingData
}

export interface BookingData {
  booking_statuses: LabelValueOption[]
  bookings: Booking[]
  current_page: number
  last_page: number
}

export interface Booking {
  id: number
  invoice_id: string
  source_id: string | null
  hotel: Hotel
  primary_guest_name: string
  primary_guest_phone: string
  booking_status: string
  source: string
  created_at: string
  check_in_date_time: string
  check_out_date_time: string
  ai_room_status: string
  checkin_id_docs: CheckinIdDoc[]
  car_plates: CarPlate[]
  checkout_images: CheckoutImage[]
  booking_rooms: BookingRoom[]
}

export interface CheckinIdDoc {
  id: number
  doc_url: string
  name: string
  identity_number: string
  created_at: string
}

export interface CarPlate {
  id: number
  doc_url: string
  plate_number: string
  created_at: string
}

export interface CheckoutImage {
  id: number
  doc_url: string
  created_at: string
}

export interface BookingRoom {
  id: number
  room_number: string
}

export interface BookingDetailResponse {
  status: string
  status_code: number
  msg: string | null
  data: BookingDetailData
}

export interface BookingDetailData {
  booking: Booking
  schedule_logs: ScheduleLog[]
  current_page: number
  last_page: number
}

export interface ScheduleLog {
  id: number
  scheduleMessage: ScheduleMessage
  to: string
  status: string
  created_at: string
}

interface InnerData {
  status: string // e.g. "PENDING"
}

interface Result {
  success: boolean
  data: InnerData
  msg: string
}

export interface BroadcastResponseData {
  result: Result
}

export interface BroadcastResponse {
  status: string
  status_code: number
  msg: string | null
  data: BroadcastResponseData
}

export interface HotelBookingSyncResponse {
  status: string
  status_code: number
  msg: string | null
  data: HotelBookingSyncData
}

export interface HotelBookingSyncData {
  booking: Booking
}
