import { ref } from 'vue'
import {
  createScheduleMessage,
  fetchHotelRoomDetail,
  fetchPropertyDetail,
  fetchPropertyList,
  fetchScheduledMessage,
  fetchScheduledMessageByPropertyId,
  getScheduledMessageTypes,
  removeScheduledMessage,
  updateHotelRoomDetail,
  updateProperty,
  updateScheduleMessage,
} from '@/services/propertyService'
import type {
  Hotel,
  HotelRoom,
  HotelRoomResponse,
  PropertyDetailData,
  PropertyDetailResponse,
  PropertyListData,
  PropertyListResponse,
  PropertyResponse,
  NoDataResponse,
  ScheduledMessageResponse,
  ScheduleMessage,
  ScheduledMessageListResponse,
  ScheduledMessageTypesResponse,
  MessageTypesData,
} from '@/interfaces/property'
import { useAuthToken } from '@/stores/useAuthToken'
import type { ExistingFileRef } from '@/components/Form/FormInput.vue'
import { useNonAuth } from './useNonAuth'

export function useProperty() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const propertyList = ref<PropertyListData | null>(null)
  const propertyDetail = ref<PropertyDetailData | null>(null)
  const scheduledMessageDetail = ref<ScheduleMessage | null>(null)
  const scheduledMessagesByProperty = ref<ScheduleMessage[] | null>(null)
  const hotelRoomDetail = ref<HotelRoom | null>(null)
  const scheduledMessageTypes = ref<MessageTypesData | null>(null)
  const { token } = useAuthToken()
  const { handleReroute } = useNonAuth()

  const loadProperties = async (): Promise<PropertyListResponse> => {
    console.log('triggered property load')
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: { hotels: [] },
      }
    }

    loading.value = true
    error.value = null
    propertyList.value = null

    try {
      const response = await fetchPropertyList(token.value)
      if (response.status === 'success') {
        propertyList.value = response.data
      } else {
        error.value = response.msg
        if (response.status_code === 401) {
          handleReroute()
        }
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to load properties.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: { hotels: [] },
      }
    } finally {
      loading.value = false
    }
  }

  const loadPropertyDetail = async (hotelId: number): Promise<PropertyDetailResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {} as PropertyDetailData,
      }
    }

    loading.value = true
    error.value = null
    propertyDetail.value = null

    try {
      const response = await fetchPropertyDetail(token.value, hotelId)
      if (response.status === 'success') {
        propertyDetail.value = response.data
      } else {
        error.value = response.msg
        if (response.status_code === 401) {
          handleReroute()
        }
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to load property detail.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: {} as PropertyDetailData,
      }
    } finally {
      loading.value = false
    }
  }

  const updatePropertyDetail = async (
    propertyId: number,
    hotelName: string,
    hotelLink: string,
    mobileNumber: string,
    address: string,
    email: string,
    latitude: string,
    longtitude: string,
    checkinTime: string,
    checkoutTime: string,
    sendToHost: number,
  ): Promise<PropertyResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {
          hotel: {} as Hotel,
        },
      }
    }

    loading.value = true
    error.value = null

    try {
      const updatedChatbotPersona = await updateProperty(
        token.value,
        propertyId,
        hotelName,
        hotelLink,
        mobileNumber,
        address,
        email,
        latitude,
        longtitude,
        checkinTime,
        checkoutTime,
        sendToHost,
      )
      if (updatedChatbotPersona.status !== 'success') {
        error.value = updatedChatbotPersona.msg
        if (updatedChatbotPersona.status_code === 401) {
          handleReroute()
        }
      }
      return updatedChatbotPersona
    } catch (err: any) {
      error.value = err.message || 'Failed to update property detail.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: {
          hotel: {} as Hotel,
        },
      }
    } finally {
      loading.value = false
    }
  }

  const loadScheduledMessage = async (
    scheduledMessageId: number,
  ): Promise<ScheduledMessageResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {
          scheduleMessage: {} as ScheduleMessage,
        },
      }
    }

    loading.value = true
    error.value = null
    scheduledMessageDetail.value = null

    try {
      const response = await fetchScheduledMessage(token.value, scheduledMessageId)
      if (response.status === 'success') {
        scheduledMessageDetail.value = response.data.scheduleMessage
      } else {
        error.value = response.msg
        if (response.status_code === 401) {
          handleReroute()
        }
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to load scheduled message.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: {
          scheduleMessage: {} as ScheduleMessage,
        },
      }
    } finally {
      loading.value = false
    }
  }

  const makeScheduleMessage = async (
    propertyId: number,
    title: string,
    messageEn: string,
    type: string,
    sendAt: string,
    file: File | ExistingFileRef | null,
    waStatus: string,
    sendCheckinInstruction: number,
    handleLateBooking: number,
  ): Promise<ScheduledMessageResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {
          scheduleMessage: {} as ScheduleMessage,
        },
      }
    }

    loading.value = true
    error.value = null

    try {
      const createdScheduleMessage = await createScheduleMessage(
        token.value,
        propertyId,
        title,
        messageEn,
        type,
        sendAt,
        file,
        waStatus,
        sendCheckinInstruction,
        handleLateBooking,
      )
      if (createdScheduleMessage.status !== 'success') {
        error.value = createdScheduleMessage.msg
        if (createdScheduleMessage.status_code === 401) {
          handleReroute()
        }
      }
      return createdScheduleMessage
    } catch (err: any) {
      error.value = err.message || 'Failed to create scheduled message.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: {
          scheduleMessage: {} as ScheduleMessage,
        },
      }
    } finally {
      loading.value = false
    }
  }

  const changeScheduleMessage = async (
    scheduleMsgId: number,
    title: string,
    messageEn: string,
    type: string,
    sendAt: string,
    file: File | ExistingFileRef | null,
    waStatus: string,
    removeFile: boolean,
    sendCheckinInstruction: number,
    handleLateBooking: number,
  ): Promise<ScheduledMessageResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {
          scheduleMessage: {} as ScheduleMessage,
        },
      }
    }

    loading.value = true
    error.value = null

    try {
      const udpatedScheduleMessage = await updateScheduleMessage(
        token.value,
        scheduleMsgId,
        title,
        messageEn,
        type,
        sendAt,
        file,
        waStatus,
        removeFile,
        sendCheckinInstruction,
        handleLateBooking,
      )
      if (udpatedScheduleMessage.status !== 'success') {
        error.value = udpatedScheduleMessage.msg
        if (udpatedScheduleMessage.status_code === 401) {
          handleReroute()
        }
      }
      return udpatedScheduleMessage
    } catch (err: any) {
      error.value = err.message || 'Failed to update scheduled message.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: {
          scheduleMessage: {} as ScheduleMessage,
        },
      }
    } finally {
      loading.value = false
    }
  }

  const removeScheduledMsgAndReload = async (
    propId: number,
    schedMsgId: number,
  ): Promise<NoDataResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: [],
      }
    }

    loading.value = true
    error.value = null

    try {
      const removeResponse = await removeScheduledMessage(token.value, schedMsgId)
      if (removeResponse.status === 'success') {
        await loadPropertyDetail(propId) //loadAiChatbotDetail(chatbotID)
      } else {
        error.value = removeResponse.msg
        if (removeResponse.status_code === 401) {
          handleReroute()
        }
      }
      return removeResponse
    } catch (err: any) {
      error.value = err.message || 'Failed to remove AI document.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: [],
      }
    } finally {
      loading.value = false
    }
  }

  const loadHotelRoom = async (propertyId: number, roomId: number): Promise<HotelRoomResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {
          hotel_room: {} as HotelRoom,
        },
      }
    }

    loading.value = true
    error.value = null
    hotelRoomDetail.value = null

    try {
      const response = await fetchHotelRoomDetail(token.value, propertyId, roomId)
      if (response.status === 'success') {
        hotelRoomDetail.value = response.data.hotel_room
      } else {
        error.value = response.msg
        if (response.status_code === 401) {
          handleReroute()
        }
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to load room detail.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: {
          hotel_room: {} as HotelRoom,
        },
      }
    } finally {
      loading.value = false
    }
  }

  const changeHotelRoomDetail = async (
    propertyId: number,
    roomId: number,
    securityBoxPwd: string,
    openaiPersona: string,
    remark: string,
    file: File | ExistingFileRef | null,
  ): Promise<HotelRoomResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {
          hotel_room: {} as HotelRoom,
        },
      }
    }

    loading.value = true
    error.value = null
    hotelRoomDetail.value = null

    try {
      const response = await updateHotelRoomDetail(
        token.value,
        propertyId,
        roomId,
        securityBoxPwd,
        openaiPersona,
        remark,
        file,
      )
      if (response.status === 'success') {
        hotelRoomDetail.value = response.data.hotel_room
      } else {
        error.value = response.msg
        if (response.status_code === 401) {
          handleReroute()
        }
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to update room detail.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: {
          hotel_room: {} as HotelRoom,
        },
      }
    } finally {
      loading.value = false
    }
  }

  const loadScheduledMessagesByProperty = async (
    propertyId: number,
  ): Promise<ScheduledMessageListResponse> => {
    // console.log('triggered property load')
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: { messages: [] },
      }
    }

    loading.value = true
    error.value = null
    scheduledMessagesByProperty.value = null

    try {
      const response = await fetchScheduledMessageByPropertyId(token.value, propertyId)
      if (response.status === 'success') {
        scheduledMessagesByProperty.value = response.data.messages
      } else {
        error.value = response.msg
        if (response.status_code === 401) {
          handleReroute()
        }
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to load scheduled message by the property id.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: { messages: [] },
      }
    } finally {
      loading.value = false
    }
  }

  const fetchScheduledMessageTypes = async (): Promise<ScheduledMessageTypesResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {} as MessageTypesData,
      }
    }

    loading.value = true
    error.value = null
    scheduledMessageTypes.value = null

    try {
      const response = await getScheduledMessageTypes(token.value)
      if (response.status === 'success') {
        scheduledMessageTypes.value = response.data
      } else {
        error.value = response.msg
        if (response.status_code === 401) {
          handleReroute()
        }
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to load scheduled message types.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: {} as MessageTypesData,
      }
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    propertyList,
    loadProperties,
    propertyDetail,
    loadPropertyDetail,
    scheduledMessageDetail,
    loadScheduledMessage,
    hotelRoomDetail,
    loadHotelRoom,
    updatePropertyDetail,
    makeScheduleMessage,
    changeScheduleMessage,
    removeScheduledMsgAndReload,
    changeHotelRoomDetail,
    scheduledMessagesByProperty,
    loadScheduledMessagesByProperty,
    scheduledMessageTypes,
    fetchScheduledMessageTypes,
  }
}
