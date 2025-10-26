<script lang="ts" setup>
import { ref, reactive, watch, onMounted } from 'vue'
import PhoneForm from './components/PhoneForm.vue'
import OtpForm from './components/OTPForm.vue'
import Footer from './components/Footer.vue'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '../../stores/dashboardItems'
import { useAuth } from '@/composables/useAuth'
import { useAuthToken } from '@/stores/useAuthToken'
import type { LoginForm } from '@/interfaces/auth'

const { loading, error, successMessage, responseData, sendOtp, checkOtp } = useAuth()
const { token } = useAuthToken()

const dashboardStore = useDashboardStore()
dashboardStore.hideSideNav()

const router = useRouter()

const step = ref(1) // step state to control which part of the form is shown

const form = reactive<LoginForm>({
  mobile_no: '',
  country_code: '60',
})
const fullPhoneNumber = ref('')
const errors = reactive<{ mobile_no?: string }>({})
const loginLoading = ref(false)

// otp form
export interface OtpForm {
  otp_code: string
}
const otpForm = reactive<OtpForm>({
  otp_code: '',
})
const otpErrors = reactive<{ otp?: string }>({})
const otpLoading = ref(false)
const delivMedia = ref('Whatsapp')

const dialingCode = ref('')
const localMobileNumber = ref('')

watch(
  () => [form.mobile_no, form.country_code],
  ([phone, country]) => {
    if (!phone) {
      localMobileNumber.value = ''
      return
    }
    try {
      dialingCode.value = country
      const prefix = '+' + dialingCode.value
      if (phone.startsWith(prefix)) {
        localMobileNumber.value = phone.slice(prefix.length)
      } else if (phone.startsWith(dialingCode.value)) {
        localMobileNumber.value = phone.slice(dialingCode.value.length)
      } else {
        localMobileNumber.value = phone
      }
    } catch {
      localMobileNumber.value = phone
    }
  },
  { immediate: true },
)

const submitPhone = async () => {
  errors.mobile_no = undefined
  loginLoading.value = true

  if (!form.mobile_no) {
    errors.mobile_no = 'Phone number is required.'
    return
  }

  await sendOtp({
    country_code: dialingCode.value,
    mobile_no: localMobileNumber.value,
    action: 'register_login',
  })

  loginLoading.value = false

  if (!error.value) {
    step.value = 2
  } else {
    errors.mobile_no = error.value
  }
}

const onSubmitOTP = async () => {
  otpErrors.otp = undefined
  otpLoading.value = true

  await checkOtp({
    country_code: dialingCode.value,
    mobile_no: localMobileNumber.value,
    otp: otpForm.otp_code,
  })

  otpLoading.value = false

  if (!error.value) {
    router.push('/ai-chatbot')
    dashboardStore.showSideNav()
  } else {
    otpErrors.otp = error.value //'Incorrect code. Try again'
  }
}

onMounted(() => {
  if (token.value) {
    router.push('/ai-chatbot')
    dashboardStore.showSideNav()
  }
})
</script>

<template>
  <section class="container">
    <div class="card-body">
      <div class="d-flex flex-column justify-content-center vh-100">
        <div class="row">
          <div class="col-12 col-lg-8">
            <img src="@/assets/robot.png" alt="Robot" class="img-fluid" />
          </div>
          <div class="col-12 col-lg-4">
            <div class="h-100 d-flex flex-column">
              <div style="flex: 1" class="d-flex flex-column justify-content-center">
                <div v-if="step === 1">
                  <PhoneForm
                    :form="form"
                    :fullPhoneNumber="fullPhoneNumber"
                    :errors="errors"
                    :loginLoading="loginLoading"
                    @submit="submitPhone"
                  />
                </div>
                <div v-if="step === 2">
                  <OtpForm
                    :form="otpForm"
                    :phone_number="form.mobile_no"
                    :otp_delivery_media="delivMedia"
                    :errors="otpErrors"
                    :otpLoading="otpLoading"
                    @submit="onSubmitOTP"
                    @resend="submitPhone"
                  />
                </div>
              </div>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style></style>
