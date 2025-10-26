import { ref } from 'vue'
import { getProfile, requestOtp, verifyOtp } from '@/services/authService'
import type {
  GeneralResponse,
  RequestOtpFormData,
  RequestOtpResponse,
  User,
  UserProfile,
  VerifyOtpFormData,
  VerifyOtpResponse,
} from '@/interfaces/auth'
import { useAuthToken } from '@/stores/useAuthToken'

export function useAuth() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const successMessage = ref<string | null>(null)
  const responseData = ref<RequestOtpResponse['data'] | null>(null)
  const userProfileData = ref<UserProfile | null>(null)
  const { token, setToken, setPhone } = useAuthToken()

  const sendOtp = async (data: RequestOtpFormData): Promise<RequestOtpResponse> => {
    loading.value = true
    error.value = null
    successMessage.value = null
    responseData.value = null

    try {
      const response = await requestOtp(data)
      if (response.status === 'success') {
        successMessage.value = response.msg
        responseData.value = response.data
      } else {
        error.value = response.msg
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to send OTP.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: {} as any,
      }
    } finally {
      loading.value = false
    }
  }

  const checkOtp = async (data: VerifyOtpFormData): Promise<GeneralResponse> => {
    loading.value = true
    error.value = null
    successMessage.value = null
    responseData.value = null

    try {
      const response = await verifyOtp(data)
      if (response.status === 'success') {
        successMessage.value = response.msg
        responseData.value = response.data
        const res: VerifyOtpResponse = response.data as VerifyOtpResponse
        setToken(res.api_token)
        setPhone(res.user.country_code + res.user.mobile_no)
      } else {
        error.value = response.msg
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to send OTP.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: {} as any,
      }
    } finally {
      loading.value = false
    }
  }

  const getUserProfile = async (): Promise<GeneralResponse> => {
    loading.value = true
    error.value = null
    successMessage.value = null
    userProfileData.value = null

    try {
      const response = await getProfile()
      if (response.status === 'success') {
        successMessage.value = response.msg
        userProfileData.value = response.data as UserProfile
      } else {
        error.value = response.msg
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to send OTP.'
      return {
        status: 'error',
        status_code: 500,
        msg: error.value,
        data: {} as any,
      }
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    successMessage,
    responseData,
    userProfileData,
    sendOtp,
    checkOtp,
    getUserProfile,
  }
}
