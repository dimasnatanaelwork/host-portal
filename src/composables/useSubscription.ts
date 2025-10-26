import { ref } from 'vue'

import { useAuthToken } from '@/stores/useAuthToken'

import {} from '@/services/aiChatbotService'
import type {
  Billing,
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
  Subscription,
  SubscriptionListResponse,
  SubscriptionsData,
  UnsubscribeResponse,
} from '@/interfaces/subscription'
import {
  fetchBillingDetail,
  fetchBillingHistory,
  fetchMySubscriptionsList,
  getPlatformTypes,
  postApplyPromo,
  postOneTimepayment,
  postSubmitChatbotRequest,
  postSubscribe,
  postUnsubscribe,
  postUpdatePmsInfo,
} from '@/services/subscriptionService'
import { useNonAuth } from './useNonAuth'
import type { GeneralResponse } from '@/interfaces/auth'

export function useSubscription() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const billingHistory = ref<BillingData | null>(null)
  const mySubscriptions = ref<SubscriptionsData | null>(null)
  const platformTypes = ref<PlatformTypeList | null>(null)
  const billingDetail = ref<Billing | null>(null)
  const promoSubscription = ref<Subscription | null>(null)

  const { token, phone } = useAuthToken()
  const { handleReroute } = useNonAuth()

  const loadMySubscriptions = async (): Promise<SubscriptionListResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {} as SubscriptionsData,
      }
    }

    loading.value = true
    error.value = null
    mySubscriptions.value = null

    try {
      const response = await fetchMySubscriptionsList(token.value)
      if (response.status === 'success') {
        mySubscriptions.value = response.data
      } else {
        error.value = response.msg
        if (response.status_code === 401) {
          handleReroute()
        }
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to load user subscription list.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value!,
        data: {} as SubscriptionsData,
      }
    } finally {
      loading.value = false
    }
  }

  const loadBillingHistory = async (page: number): Promise<BillingHisResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {} as BillingData,
      }
    }

    loading.value = true
    error.value = null
    billingHistory.value = null

    try {
      const response = await fetchBillingHistory(token.value, page)
      if (response.status === 'success') {
        billingHistory.value = response.data
      } else {
        error.value = response.msg
        if (response.status_code === 401) {
          handleReroute()
        }
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to load billing data.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value!,
        data: {} as BillingData,
      }
    } finally {
      loading.value = false
    }
  }

  const loadBillingDetail = async (orderUuid: string): Promise<BillingDetailResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {} as BillingDetailData,
      }
    }

    loading.value = true
    error.value = null
    billingDetail.value = null

    try {
      const response = await fetchBillingDetail(token.value, orderUuid)
      if (response.status === 'success') {
        billingDetail.value = response.data.billing
      } else {
        error.value = response.msg
        if (response.status_code === 401) {
          handleReroute()
        }
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to load billing data.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value!,
        data: {} as BillingDetailData,
      }
    } finally {
      loading.value = false
    }
  }

  const applyPromo = async (promoCode: string, aibotId: number): Promise<PromoCodeResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {} as PromoCodeData,
      }
    }

    loading.value = true
    error.value = null
    promoSubscription.value = null

    try {
      const response = await postApplyPromo(token.value, promoCode, aibotId)
      if (response.status === 'success') {
        promoSubscription.value = response.data.subscription
      } else {
        error.value = response.msg
        if (response.status_code === 401) {
          handleReroute()
        }
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to subscribe.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value!,
        data: {} as PromoCodeData,
      }
    } finally {
      loading.value = false
    }
  }

  const subscribe = async (
    aibot_id: number,
    packageType: 'monthly' | 'yearly',
    // redirectUrl: string,
  ): Promise<SubscribeResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {
          payment_url: '',
        },
      }
    }

    loading.value = true
    error.value = null

    try {
      const subRes = await postSubscribe(token.value, aibot_id, packageType)
      if (subRes.status !== 'success') {
        error.value = subRes.msg
        if (subRes.status_code === 401) {
          handleReroute()
        }
      }
      return subRes
    } catch (err: any) {
      error.value = err.message || 'Failed to subscribe.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value!,
        data: {
          payment_url: '',
        },
      }
    } finally {
      loading.value = false
    }
  }

  const unsubscribe = async (subsId: number): Promise<UnsubscribeResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {} as SingleSubscriptionData,
      }
    }

    loading.value = true
    error.value = null

    try {
      const unsubRes = await postUnsubscribe(token.value, subsId)
      if (unsubRes.status === 'success') {
        await loadMySubscriptions()
      } else {
        error.value = unsubRes.msg
        if (unsubRes.status_code === 401) {
          handleReroute()
        }
      }
      return unsubRes
    } catch (err: any) {
      error.value = err.message || 'Failed to unsubscribe.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value!,
        data: {} as SingleSubscriptionData,
      }
    } finally {
      loading.value = false
    }
  }

  const loadPlatformTypes = async (): Promise<PlatformTypesResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {} as PlatformTypeList,
      }
    }

    loading.value = true
    error.value = null
    platformTypes.value = null

    try {
      const response = await getPlatformTypes(token.value)
      if (response.status === 'success') {
        platformTypes.value = response.data
      } else {
        error.value = response.msg
        if (response.status_code === 401) {
          handleReroute()
        }
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to load platform types.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value!,
        data: {} as PlatformTypeList,
      }
    } finally {
      loading.value = false
    }
  }

  const submitChatbot = async (
    platformType: string,
    chatbotName: string,
    dynamicFields: Record<string, any> = {},
  ): Promise<ChatbotRequestResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {} as ChatbotReqData,
      }
    }

    loading.value = true
    error.value = null

    try {
      const res = await postSubmitChatbotRequest(
        token.value,
        platformType,
        chatbotName,
        dynamicFields,
      )
      if (res.status !== 'success') {
        error.value = res.msg
        if (res.status_code === 401) {
          handleReroute()
        }
      }
      return res
    } catch (err: any) {
      error.value = err.message || 'Failed to submit chatbot.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value!,
        data: {} as ChatbotReqData,
      }
    } finally {
      loading.value = false
    }
  }

  // postUpdatePmsInfo
  const submitPmsInfo = async (
    platformType: string,
    propertyId: number,
    dynamicFields: Record<string, any> = {},
  ): Promise<GeneralResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {},
      }
    }

    loading.value = true
    error.value = null

    try {
      const res = await postUpdatePmsInfo(token.value, platformType, propertyId, dynamicFields)
      if (res.status !== 'success') {
        error.value = res.msg
        if (res.status_code === 401) {
          handleReroute()
        }
      }
      return res
    } catch (err: any) {
      error.value = err.message || 'Failed to update.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value!,
        data: {},
      }
    } finally {
      loading.value = false
    }
  }

  const makeOneTimePayment = async (
    aibot_id: number,
    packageType: 'monthly' | 'yearly',
  ): Promise<SubscribeResponse> => {
    if (!token.value) {
      error.value = 'No authentication token found. Please login.'
      return {
        status: 'error',
        status_code: 401,
        msg: error.value,
        data: {
          payment_url: '',
        },
      }
    }

    loading.value = true
    error.value = null

    try {
      const response = await postOneTimepayment(token.value, aibot_id, packageType)
      if (response.status !== 'success') {
        error.value = response.msg
        if (response.status_code === 401) {
          handleReroute()
        }
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to trigger one time payment.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value!,
        data: {
          payment_url: '',
        },
      }
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    billingHistory,
    loadBillingHistory,
    mySubscriptions,
    loadMySubscriptions,
    subscribe,
    makeOneTimePayment,
    unsubscribe,
    platformTypes,
    loadPlatformTypes,
    submitChatbot,
    billingDetail,
    loadBillingDetail,
    submitPmsInfo,
    promoSubscription,
    applyPromo,
  }
}
