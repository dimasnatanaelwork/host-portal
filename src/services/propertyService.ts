// NOTE: This service now returns dummy data for local development/testing.
// Real network calls were removed. Re-enable axios/HOST_URL usage to call the real API.
import axios from 'axios'
import type {
  Hotel,
  HotelRoom,
  HotelRoomResponse,
  PropertyDetailData,
  PropertyDetailResponse,
  PropertyListResponse,
  PropertyResponse,
  NoDataResponse,
  ScheduledMessageResponse,
  ScheduleMessage,
  ScheduledMessageListResponse,
  ScheduledMessageTypesResponse,
  MessageTypesData,
} from '@/interfaces/property'
import type { ExistingFileRef } from '@/components/Form/FormInput.vue'

const HOST_URL = import.meta.env.VITE_API_HOST

export async function fetchPropertyList(token: string): Promise<PropertyListResponse> {
  // Return dummy property list
  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      hotels: [
        {
          id: 1,
          hotel_name: 'Demo Hotel',
          mobile_number: '+1234567890',
          email: 'demo@hotel.com',
          check_in_time: '14:00',
          check_out_time: '12:00',
          address: '123 Demo St',
          latitude: '0',
          longtitude: '0',
          hotel_link: '',
          host_mobile_no: '',
          send_to_host: 0,
          boardcast_channel: '',
          total_units: 10,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          hotel_id: 'H-1',
          hp_external_property_id: null,
          hp_access_token: '',
          ezee_auth_code: null,
          ezee_hotel_code: null,
          hostaway_acc_secret: null,
          system_platform: '',
          is_pms_intergrated: 0,
        },
      ],
    },
  }
}

export async function fetchPropertyDetail(
  token: string,
  hotelId: number,
): Promise<PropertyDetailResponse> {
  // Return dummy property detail
  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      hotel: {
        id: hotelId,
        hotel_name: `Demo Hotel ${hotelId}`,
        mobile_number: '+1234567890',
        email: 'demo@hotel.com',
        check_in_time: '14:00',
        check_out_time: '12:00',
        address: '123 Demo St',
        latitude: '0',
        longtitude: '0',
        hotel_link: '',
        host_mobile_no: '',
        send_to_host: 0,
        boardcast_channel: '',
        total_units: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        hotel_id: `H-${hotelId}`,
        hp_external_property_id: null,
        hp_access_token: '',
        ezee_auth_code: null,
        ezee_hotel_code: null,
        hostaway_acc_secret: null,
        system_platform: '',
        is_pms_intergrated: 0,
      },
      schedule_messages: [],
      hotel_rooms: [],
    },
  }
}

export async function updateProperty(
  token: string,
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
): Promise<PropertyResponse> {
  // Return dummy updated property
  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      hotel: {
        id: propertyId,
        hotel_name: hotelName,
        mobile_number: mobileNumber,
        email: email,
        check_in_time: checkinTime,
        check_out_time: checkoutTime,
        address: address,
        latitude: latitude,
        longtitude: longtitude,
        hotel_link: hotelLink,
        host_mobile_no: '',
        send_to_host: sendToHost,
        boardcast_channel: '',
        total_units: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        hotel_id: `H-${propertyId}`,
        hp_external_property_id: null,
        hp_access_token: '',
        ezee_auth_code: null,
        ezee_hotel_code: null,
        hostaway_acc_secret: null,
        system_platform: '',
        is_pms_intergrated: 0,
      },
    },
  }
}

export async function fetchScheduledMessage(
  token: string,
  scheduledMessageId: number,
): Promise<ScheduledMessageResponse> {
  // Return dummy scheduled message
  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      scheduleMessage: {
        id: scheduledMessageId,
        title: `Demo Msg ${scheduledMessageId}`,
        message_type: { type: 'info', label: 'Info' },
        send_at: null,
        content: 'This is a demo scheduled message',
        send_checkin_instruction: 0,
        doc_url: '',
        handle_late_booking: 0,
        need_track_review: 0,
        sources: [],
        platforms: [],
        wa_status: 'draft',
        boardcast_channel: '',
        meta_info: {
          template_name: '',
          template_id: '',
          template_status: '',
          template_category: '',
          template_msg: '',
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    },
  }
}

export async function createScheduleMessage(
  token: string,
  propertyId: number,
  title: string,
  messageEn: string,
  type: string,
  sendAt: string,
  file: File | ExistingFileRef | null,
  waStatus: string, // draft/active
  sendCheckinInstruction: number,
  handleLateBooking: number,
): Promise<ScheduledMessageResponse> {
  // Return created dummy scheduled message
  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      scheduleMessage: {
        id: Math.floor(Math.random() * 10000),
        title,
        message_type: { type, label: type },
        send_at: sendAt || null,
        content: messageEn,
        send_checkin_instruction: sendCheckinInstruction,
        doc_url: file instanceof File ? `file://${file.name}` : '',
        handle_late_booking: handleLateBooking,
        need_track_review: 0,
        sources: [],
        platforms: [],
        wa_status: waStatus,
        boardcast_channel: '',
        meta_info: {
          template_name: '',
          template_id: '',
          template_status: '',
          template_category: '',
          template_msg: '',
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    },
  }
}

// /api/property/updateScheduleMessage
export async function updateScheduleMessage(
  token: string,
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
): Promise<ScheduledMessageResponse> {
  // Return updated dummy scheduled message
  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      scheduleMessage: {
        id: scheduleMsgId,
        title,
        message_type: { type, label: type },
        send_at: sendAt || null,
        content: messageEn,
        send_checkin_instruction: sendCheckinInstruction,
        doc_url: file instanceof File ? `file://${file.name}` : '',
        handle_late_booking: handleLateBooking,
        need_track_review: 0,
        sources: [],
        platforms: [],
        wa_status: waStatus,
        boardcast_channel: '',
        meta_info: {
          template_name: '',
          template_id: '',
          template_status: '',
          template_category: '',
          template_msg: '',
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    },
  }
}

export async function fetchHotelRoomDetail(
  token: string,
  propertyId: number,
  roomId: number,
): Promise<HotelRoomResponse> {
  // Return dummy hotel room
  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      hotel_room: {
        id: roomId,
        room_number: `R-${roomId}`,
        securitybox_password: '',
        openai_persona: '',
        remark: '',
        checkin_instruction_doc_url: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    },
  }
}

export async function removeScheduledMessage(
  token: string,
  schedMsgId: number,
): Promise<NoDataResponse> {
  // Return dummy no-data response
  return {
    status: 'success',
    status_code: 200,
    msg: 'Removed',
    data: [],
  }
}

export async function updateHotelRoomDetail(
  token: string,
  propertyId: number,
  roomId: number,
  securityBoxPwd: string,
  openaiPersona: string,
  remark: string,
  file: File | ExistingFileRef | null,
): Promise<HotelRoomResponse> {
  // Return updated dummy hotel room
  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      hotel_room: {
        id: roomId,
        room_number: `R-${roomId}`,
        securitybox_password: securityBoxPwd,
        openai_persona: openaiPersona,
        remark: remark,
        checkin_instruction_doc_url: file instanceof File ? `file://${file.name}` : '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    },
  }
}

export async function fetchScheduledMessageByPropertyId(
  token: string,
  propertyId: number,
): Promise<ScheduledMessageListResponse> {
  // Return dummy list of scheduled messages
  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      messages: [
        {
          id: 1,
          title: 'Demo Msg',
          message_type: { type: 'info', label: 'Info' },
          send_at: null,
          content: 'Demo',
          send_checkin_instruction: 0,
          doc_url: '',
          handle_late_booking: 0,
          need_track_review: 0,
          sources: [],
          platforms: [],
          wa_status: 'draft',
          boardcast_channel: '',
          meta_info: {
            template_name: '',
            template_id: '',
            template_status: '',
            template_category: '',
            template_msg: '',
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    },
  }
}

// /api/property/listScheduleMessageTypes
export async function getScheduledMessageTypes(
  token: string,
): Promise<ScheduledMessageTypesResponse> {
  // Return dummy message types
  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      schedule_messsage_types: [
        { label: 'Info', value: 'info' },
        { label: 'Reminder', value: 'reminder' },
      ],
    },
  }
}
