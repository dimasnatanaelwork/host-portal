import { ref } from 'vue'

import { useAuthToken } from '@/stores/useAuthToken'

import {} from '@/services/aiChatbotService'
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
import {
  broadcastMessage,
  fetchBookingDetail,
  fetchBookings,
  syncSingleHotelBooking,
} from '@/services/bookingService'
import { useNonAuth } from './useNonAuth'

export function useBooking() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const bookingList = ref<BookingData | null>(null)
  const bookingDetail = ref<BookingDetailData | null>(null)

  const { token, phone } = useAuthToken()
  const { handleReroute } = useNonAuth()

  const loadBookings = async (
    searchKeyword: string,
    startDate: string,
    endDate: string,
    page: number,
    bookingStatuses: string[],
  ): Promise<BookingsResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {} as BookingData,
      }
    }

    loading.value = true
    error.value = null
    bookingList.value = null

    try {
      const response = await fetchBookings(
        token.value,
        searchKeyword,
        startDate,
        endDate,
        page,
        bookingStatuses,
      )
      if (response.status === 'success') {
        bookingList.value = response.data
      } else {
        error.value = response.msg
        if (response.status_code === 401) {
          handleReroute()
        }
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to load ai chatbots.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: {} as BookingData,
      }
    } finally {
      loading.value = false
    }
  }

  const loadBookingDetail = async (bookingID: number): Promise<BookingDetailResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {} as BookingDetailData,
      }
    }

    loading.value = true
    error.value = null
    bookingDetail.value = null

    try {
      const response = await fetchBookingDetail(token.value, bookingID)
      if (response.status === 'success') {
        bookingDetail.value = response.data
      } else {
        error.value = response.msg
        if (response.status_code === 401) {
          handleReroute()
        }
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to load chatbot detail.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: {} as BookingDetailData,
      }
    } finally {
      loading.value = false
    }
  }

  const sendBroadcastMessage = async (
    property_id: number,
    booking_id: number,
    message_id: number,
    to: string,
  ): Promise<BroadcastResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {} as BroadcastResponseData,
      }
    }

    if (to == '' || to == null) {
      if (!phone.value) {
        error.value = 'No phone number found. Please login.'
        return {
          status: 'error',
          status_code: 401,
          msg: error.value,
          data: {} as BroadcastResponseData,
        }
      } else {
        to = phone.value
      }
    }

    loading.value = true
    error.value = null

    try {
      const broadcastedMsg = await broadcastMessage(
        token.value,
        property_id,
        booking_id,
        message_id,
        to,
      )
      if (broadcastedMsg.status !== 'success') {
        error.value = broadcastedMsg.msg
        if (broadcastedMsg.status_code === 401) {
          handleReroute()
        }
      }

      return broadcastedMsg
    } catch (err: any) {
      error.value = err.message || 'Failed to send broadcast message.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: {} as BroadcastResponseData,
      }
    } finally {
      loading.value = false
    }
  }

  const syncHotelBooking = async (
    property_id: number,
    booking_number: string,
  ): Promise<HotelBookingSyncResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {} as HotelBookingSyncData,
      }
    }

    loading.value = true
    error.value = null

    try {
      const res = await syncSingleHotelBooking(token.value, property_id, booking_number)
      if (res.status !== 'success') {
        error.value = res.msg
        if (res.status_code === 401) {
          handleReroute()
        }
      }
      return res
    } catch (err: any) {
      error.value = err.message || 'Failed to sync booking data.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: {} as HotelBookingSyncData,
      }
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    bookingList,
    bookingDetail,
    loadBookings,
    loadBookingDetail,
    sendBroadcastMessage,
    syncHotelBooking,
  }
}
