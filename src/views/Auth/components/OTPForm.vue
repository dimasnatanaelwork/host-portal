<script lang="ts" setup>
import AuthBtn from '@/components/Buttons/AuthBtn.vue'
import { ref } from 'vue'
import VOtpInput from 'vue3-otp-input'
import type { OtpForm } from '../Auth.vue'

const props = defineProps<{
  form: OtpForm
  phone_number: string
  otp_delivery_media: string
  errors: { otp?: string }
  otpLoading: boolean
}>()
const otpInput = ref<InstanceType<typeof VOtpInput> | null>(null)

const handleOnComplete = (value: string) => {
  onSubmitOTP()
}

const handleOnChange = (value: string) => {
  // console.log('OTP changed: ', value)
}

const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'resend'): void
}>()

function onSubmitOTP() {
  emit('submit')
}

const timeLeft = ref(59)
const isCountingDown = ref(false)
let intervalId: ReturnType<typeof setInterval> | null = null

const startCountdown = () => {
  if (isCountingDown.value) return

  timeLeft.value = 59
  isCountingDown.value = true

  intervalId = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(intervalId!)
      isCountingDown.value = false
    }
  }, 1000)
}

startCountdown()

const resendWhatsapp = () => {
  emit('resend')
  startCountdown()
}

const sendSMS = () => {
  emit('resend')
  startCountdown()
}
</script>

<template>
  <div class="d-flex flex-row justify-content-center">
    <div class="my-3" style="max-width: 23rem">
      <h3 class="mb-3">Verify Phone</h3>
      <div class="mb-3">
        <span class="medium-text">
          A 6-digits OTP has been sent to {{ props.phone_number }} via
          {{ props.otp_delivery_media }}
        </span>
      </div>
      <div class="d-flex flex-row">
        <v-otp-input
          ref="otpInput"
          input-classes="otp-input"
          :conditionalClass="['one', 'two', 'three', 'four']"
          separator=""
          inputType="number"
          :num-inputs="6"
          v-model:value="props.form.otp_code"
          :should-auto-focus="true"
          :should-focus-order="true"
          @on-change="handleOnChange"
          @on-complete="handleOnComplete"
        />
      </div>
      <div v-if="props.errors!.otp" class="text-danger">
        {{ props.errors!.otp }}
      </div>
      <div class="d-flex flex-row my-3">
        <div v-if="isCountingDown === false" class="text-center">
          <span class="text-center medium-text">
            Still didn’t get the code? Resend code thru:
          </span>
          <span class="text-center medium-text">
            <span style="font-weight: bold; color: red; cursor: pointer" @click="resendWhatsapp"
              >Resend Again</span
            >
            or
            <span style="font-weight: bold; color: red; cursor: pointer" @click="sendSMS"
              >Send via SMS</span
            >
          </span>
        </div>
        <div v-else>
          <span class="text-center medium-text">
            If you didn’t get verification code yet. Relax! We will send it to you within
            <span style="font-weight: bold; color: red">{{ timeLeft }} s</span>
          </span>
        </div>
      </div>
      <AuthBtn btn_text="Verify OTP" :btn_func="onSubmitOTP" :isLoading="otpLoading" />
    </div>
  </div>
</template>

<style>
.otp-input {
  width: 40px;
  height: 40px;
  padding: 5px;
  margin: 0 10px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
}
/* Background colour of an input field with value */
.otp-input.is-complete {
  background-color: #e4e4e4;
}
.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input::placeholder {
  font-size: 15px;
  text-align: center;
  font-weight: 600;
}
</style>
