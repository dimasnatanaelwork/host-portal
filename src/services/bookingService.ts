// NOTE: This service now returns dummy data for local development/testing.
// Real network calls were removed. Restore axios/HOST_URL usage to re-enable API requests.
import type {
  BookingData,
  BookingDetailData,
  BookingDetailResponse,
  BookingsResponse,
  BroadcastResponse,
  BroadcastResponseData,
  HotelBookingSyncData,
  HotelBookingSyncResponse,
} from '@/interfaces/booking'
import axios from 'axios'

const HOST_URL = import.meta.env.VITE_API_HOST

export async function fetchBookings(
  token: string,
  searchKeyword: string,
  startDate: string,
  endDate: string,
  page: number,
  bookingStatuses: string[],
): Promise<BookingsResponse> {
  // Return dummy bookings list
  const sampleHotel = {
    id: 1,
    hotel_id: 'H-1',
    hotel_name: 'Demo Hotel',
    address: '123 Demo St',
    mobile_number: '+1234567890',
    email: 'demo@hotel.com',
    latitude: '0',
    longtitude: '0',
    hotel_link: '',
    host_mobile_no: '',
    send_to_host: 0,
    boardcast_channel: '',
    total_units: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    check_in_time: '14:00',
    check_out_time: '12:00',
    hp_external_property_id: null,
    hp_access_token: '',
    ezee_auth_code: null,
    ezee_hotel_code: null,
    hostaway_acc_secret: null,
    system_platform: '',
    is_pms_intergrated: 0,
  }

  const booking = {
    id: 1,
    invoice_id: 'INV-1',
    source_id: null,
    hotel: sampleHotel,
    primary_guest_name: 'John Doe',
    primary_guest_phone: '+1234567890',
    booking_status: 'confirmed',
    source: 'manual',
    created_at: new Date().toISOString(),
    check_in_date_time: new Date().toISOString(),
    check_out_date_time: new Date(Date.now() + 86400000).toISOString(),
    ai_room_status: 'available',
    checkin_id_docs: [],
    car_plates: [],
    checkout_images: [],
    booking_rooms: [{ id: 1, room_number: '101' }],
  }

  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      booking_statuses: bookingStatuses.map((s) => ({ label: s, value: s })),
      bookings: [booking],
      current_page: page,
      last_page: 1,
    },
  }
}

export async function fetchBookingDetail(
  token: string,
  bookingID: number,
): Promise<BookingDetailResponse> {
  // Return dummy booking detail
  const sampleHotel = {
    id: 1,
    hotel_id: 'H-1',
    hotel_name: 'Demo Hotel',
    address: '123 Demo St',
    mobile_number: '+1234567890',
    email: 'demo@hotel.com',
    latitude: '0',
    longtitude: '0',
    hotel_link: '',
    host_mobile_no: '',
    send_to_host: 0,
    boardcast_channel: '',
    total_units: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    check_in_time: '14:00',
    check_out_time: '12:00',
    hp_external_property_id: null,
    hp_access_token: '',
    ezee_auth_code: null,
    ezee_hotel_code: null,
    hostaway_acc_secret: null,
    system_platform: '',
    is_pms_intergrated: 0,
  }

  const booking = {
    id: bookingID,
    invoice_id: `INV-${bookingID}`,
    source_id: null,
    hotel: sampleHotel,
    primary_guest_name: 'John Doe',
    primary_guest_phone: '+1234567890',
    booking_status: 'confirmed',
    source: 'manual',
    created_at: new Date().toISOString(),
    check_in_date_time: new Date().toISOString(),
    check_out_date_time: new Date(Date.now() + 86400000).toISOString(),
    ai_room_status: 'available',
    checkin_id_docs: [],
    car_plates: [],
    checkout_images: [],
    booking_rooms: [{ id: 1, room_number: '101' }],
  }

  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      booking,
      schedule_logs: [],
      current_page: 1,
      last_page: 1,
    },
  }
}

export async function broadcastMessage(
  token: string,
  property_id: number,
  booking_id: number,
  message_id: number,
  to: string,
): Promise<BroadcastResponse> {
  // /api/propertyBookings/broadcastMessage
  // Return dummy broadcast result
  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      result: {
        success: true,
        data: { status: 'SENT' },
        msg: 'Message broadcasted',
      },
    },
  }
}

export async function syncSingleHotelBooking(
  token: string,
  property_id: number,
  booking_number: string,
): Promise<HotelBookingSyncResponse> {
  // Return dummy sync result
  const booking = {
    id: 123,
    invoice_id: booking_number,
    source_id: null,
    hotel: {
      id: property_id,
      hotel_id: `H-${property_id}`,
      hotel_name: 'Demo Hotel',
      address: '123 Demo St',
      mobile_number: '+1234567890',
      email: 'demo@hotel.com',
      latitude: '0',
      longtitude: '0',
      hotel_link: '',
      host_mobile_no: '',
      send_to_host: 0,
      boardcast_channel: '',
      total_units: 10,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      check_in_time: '14:00',
      check_out_time: '12:00',
      hp_external_property_id: null,
      hp_access_token: '',
      ezee_auth_code: null,
      ezee_hotel_code: null,
      hostaway_acc_secret: null,
      system_platform: '',
      is_pms_intergrated: 0,
    },
    primary_guest_name: 'John Doe',
    primary_guest_phone: '+1234567890',
    booking_status: 'confirmed',
    source: 'sync',
    created_at: new Date().toISOString(),
    check_in_date_time: new Date().toISOString(),
    check_out_date_time: new Date(Date.now() + 86400000).toISOString(),
    ai_room_status: 'available',
    checkin_id_docs: [],
    car_plates: [],
    checkout_images: [],
    booking_rooms: [{ id: 1, room_number: '101' }],
  }

  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: { booking },
  }
}
