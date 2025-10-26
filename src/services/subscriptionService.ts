// NOTE: This service returns dummy data for local development/testing.
// Real network calls removed. Re-enable axios/HOST_URL to use the real API.
import axios from 'axios'
import type {
  BillingData,
  BillingDetailData,
  BillingDetailResponse,
  BillingHisResponse,
  ChatbotReqData,
  ChatbotRequestResponse,
  PlatformTypeList,
  PlatformTypesResponse,
  PromoCodeData,
  PromoCodeResponse,
  SingleSubscriptionData,
  SubscribeResponse,
  SubscriptionListResponse,
  SubscriptionsData,
  UnsubscribeResponse,
} from '@/interfaces/subscription'
import type { GeneralResponse } from '@/interfaces/auth'

const HOST_URL = import.meta.env.VITE_API_HOST
const PORTAL_HOST = import.meta.env.VITE_BPORTAL_HOST

export async function fetchMySubscriptionsList(token: string): Promise<SubscriptionListResponse> {
  return {
    status: 'success',
    status_code: 200,
    msg: '',
    data: {
      subscriptions: [
        {
          id: 1,
          name: 'Demo Subscription',
          subscription: {
            status: 'active',
            next_billing_at: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
            expired_at: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
            twoc2p_card_token: '',
            twoc2p_card_no: '',
            package_type: 'monthly',
            is_trial: 0,
            is_paused: 0,
          },
          total_unit: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          billing_charges: [],
          subscription_package: {
            recurring: { sst: '0', sub_total: '0', total: '0', charge_at: '' },
            first_time: { sst: '0', sub_total: '0', total: '0', charge_at: '' },
          },
        },
      ],
    },
  }
}

export async function fetchBillingHistory(
  token: string,
  page: number,
): Promise<BillingHisResponse> {
  return {
    status: 'success',
    status_code: 200,
    msg: '',
    data: {
      billings: [],
      current_page: page,
      last_page: 1,
    },
  }
}

export async function fetchBillingDetail(
  token: string,
  order_uuid: string,
): Promise<BillingDetailResponse> {
  return {
    status: 'success',
    status_code: 200,
    msg: '',
    data: {
      billing: {
        id: 1,
        chatbot_id: null,
        uuid: order_uuid,
        paid_at: new Date().toISOString(),
        name: 'Demo Billing',
        package_type: 'monthly',
        sub_total: '0',
        sst: '0',
        total_payment: '0',
        payment_method: 'fpx',
        payment_type: 'charge',
        status: 'paid',
        invoice_url: '',
        receipt_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        payment_due_date: new Date().toISOString(),
      },
    },
  }
}

export async function postApplyPromo(
  token: string,
  promoCode: string,
  aibotId: number,
): Promise<PromoCodeResponse> {
  return {
    status: 'success',
    status_code: 200,
    msg: '',
    data: {
      subscription: {
        id: 1,
        name: 'Demo Subscription',
        subscription: {
          status: 'active',
          next_billing_at: new Date().toISOString(),
          expired_at: new Date().toISOString(),
          twoc2p_card_token: '',
          twoc2p_card_no: '',
          package_type: 'monthly',
          is_trial: 0,
          is_paused: 0,
        },
        total_unit: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        billing_charges: [],
        subscription_package: {
          recurring: { sst: '0', sub_total: '0', total: '0', charge_at: '' },
          first_time: { sst: '0', sub_total: '0', total: '0', charge_at: '' },
        },
      },
    },
  }
}

export async function postSubscribe(
  token: string,
  aibot_id: number,
  packageType: 'monthly' | 'yearly',
): Promise<SubscribeResponse> {
  return {
    status: 'success',
    status_code: 200,
    msg: '',
    data: {
      payment_url: `${PORTAL_HOST}/mock-payment?aiBot=${aibot_id}&pkg=${packageType}`,
    },
  }
}

export async function postUnsubscribe(token: string, subId: number): Promise<UnsubscribeResponse> {
  return {
    status: 'success',
    status_code: 200,
    msg: '',
    data: {
      subscription: {
        id: subId,
        name: 'Demo Subscription',
        subscription: {
          status: 'inactive',
          next_billing_at: '',
          expired_at: new Date().toISOString(),
          twoc2p_card_token: '',
          twoc2p_card_no: '',
          package_type: 'monthly',
          is_trial: 0,
          is_paused: 0,
        },
        total_unit: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        billing_charges: [],
        subscription_package: {
          recurring: { sst: '0', sub_total: '0', total: '0', charge_at: '' },
          first_time: { sst: '0', sub_total: '0', total: '0', charge_at: '' },
        },
      },
    },
  }
}

// get /api/aibots/listPlatformTypes
export async function getPlatformTypes(token: string): Promise<PlatformTypesResponse> {
  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      platform_types: [
        { value: 'whatsapp', label: 'WhatsApp', require_fields: [] },
        { value: 'chatwoot', label: 'Chatwoot', require_fields: [] },
      ],
    },
  }
}

// chatbot creation request
export async function postSubmitChatbotRequest(
  token: string,
  platformType: string,
  chatbotName: string,
  dynamicFields: Record<string, any> = {},
): Promise<ChatbotRequestResponse> {
  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      chatbot_setup_request: {
        user_id: 1,
        platform_type: platformType,
        chatbot_name: chatbotName,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        id: Math.floor(Math.random() * 10000),
        merchant_id: 1,
        system_platform_other: null,
      },
      ai_chatbot: {} as any,
      hotel: {} as any,
    },
  }
}

// update pms info
export async function postUpdatePmsInfo(
  token: string,
  platformType: string,
  propertyId: number,
  dynamicFields: Record<string, any> = {},
): Promise<GeneralResponse> {
  return {
    status: 'success',
    status_code: 200,
    msg: 'Updated',
    data: {},
  }
}

// for fpx payment
export async function postOneTimepayment(
  token: string,
  aiBotId: number,
  packageType: string,
): Promise<SubscribeResponse> {
  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      payment_url: `${PORTAL_HOST}/mock-payment?aiBot=${aiBotId}&pkg=${packageType}`,
    },
  }
}
