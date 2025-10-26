export interface LoginForm {
  mobile_no: string
  country_code: string
}

export interface RequestOtpFormData {
  mobile_no: string
  country_code: string
  action: string // e.g. "register_login"
}

export interface GeneralResponse {
  status: string
  status_code: number
  msg: string | null
  data: any
}

export interface RequestOtpResult {
  type: string
  result: string[] // e.g. ["PENDING"]
  status: string
}

export interface RequestOtpData {
  mobile: string
  status: string
  action: string
  result: RequestOtpResult
  updated_at: string // ISO datetime string
  created_at: string // ISO datetime string
  id: number
}

export interface RequestOtpResponse {
  status: string // e.g. "success"
  status_code: number // e.g. 200
  msg: string | null // e.g. "OTP sent."
  data: RequestOtpData
}

export interface VerifyOtpFormData {
  mobile_no: string
  country_code: string
  otp: string
}

export interface VerifyOtpResponse {
  user: User
  api_token: string
}

export interface UserProfile {
  user: User
}

export interface User {
  id: number
  referral_code: string
  name: string | null
  email: string | null
  country_code: string
  mobile_no: string
  email_verified_at: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}
