// NOTE: This service returns dummy data for local development/testing.
// All real network calls were removed and replaced with typed mock responses.
// Re-enable axios/HOST_URL requests if you need to communicate with a real API.
import axios from 'axios'
import type {
  GeneralResponse,
  RequestOtpFormData,
  RequestOtpResponse,
  VerifyOtpFormData,
} from '@/interfaces/auth'
import type { NoDataResponse } from '@/interfaces/property'
import { useAuthToken } from '@/stores/useAuthToken'

const HOST_URL = import.meta.env.VITE_API_HOST

const { token } = useAuthToken()

export async function requestOtp(data: RequestOtpFormData): Promise<RequestOtpResponse> {
  // Return dummy OTP request result
  return {
    status: 'success',
    status_code: 200,
    msg: 'OTP sent.',
    data: {
      mobile: data.mobile_no,
      status: 'PENDING',
      action: data.action,
      result: {
        type: 'sms',
        result: ['PENDING'],
        status: 'PENDING',
      },
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      id: Math.floor(Math.random() * 10000),
    },
  }
}

export async function verifyOtp(data: VerifyOtpFormData): Promise<GeneralResponse> {
  // Return dummy verification result (user + api_token)
  return {
    status: 'success',
    status_code: 200,
    msg: 'Verified',
    data: {
      user: {
        id: 1,
        referral_code: 'REF123',
        name: null,
        email: null,
        country_code: data.country_code,
        mobile_no: data.mobile_no,
        email_verified_at: null,
        deleted_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      api_token: `token_${Math.random().toString(36).slice(2)}`,
    },
  }
}

export async function getProfile(): Promise<GeneralResponse> {
  if (!token.value) {
    return {
      status: 'error',
      status_code: 401,
      msg: 'No authentication token found.',
      data: [],
    }
  }

  // Return dummy profile
  return {
    status: 'success',
    status_code: 200,
    msg: null,
    data: {
      id: 1,
      referral_code: 'REF123',
      name: 'Demo User',
      email: 'demo@example.com',
      country_code: '+1',
      mobile_no: '1234567890',
      email_verified_at: null,
      deleted_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  }
}

export async function logout(): Promise<NoDataResponse> {
  if (!token.value) {
    return {
      status: 'error',
      status_code: 401,
      msg: 'No authentication token found.',
      data: [],
    }
  }

  return {
    status: 'success',
    status_code: 200,
    msg: 'Logged out',
    data: [],
  }
}
