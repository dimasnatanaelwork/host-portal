<script lang="ts" setup>
import TopIconPopup from '@/components/Popup/TopIconPopup.vue'
import { formatToDate, formatToDatetime2, toTitleCaseFromSnakeOrKebab } from '@/utils/utils'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  botId: number
  status: 'success' | 'failed'
  totalPayment: string
  refNumber: string
  paymentTime: string
  paymentMethod: string
  isTokenization: boolean
  nextPayment?: string
  resultPopupVisible: boolean
}>()

let countdownInterval: number | null = null
const countdown = ref(5)

const emits = defineEmits<{
  (e: 'cancel'): void
  (e: 'paynow', botId: number): void
  (e: 'gotosub', botId: number): void
  (e: 'gotobot', botId: number): void
}>()

const onCancel = () => {
  emits('cancel')
}

const onGoToSub = () => {
  // console.log('emit to go to sub triggered')
  emits('gotosub', props.botId)
}

const onPayNow = () => {
  emits('paynow', props.botId)
}

const shouldStartCountdown = computed(() => props.isTokenization && props.status === 'success')

const startCountdown = () => {
  if (countdownInterval) return // Already running

  // console.log('Starting countdown interval')
  countdown.value = 5 // Reset countdown
  countdownInterval = window.setInterval(() => {
    // console.log('Countdown tick:', countdown.value)
    if (countdown.value > 0) {
      countdown.value -= 1
    } else {
      // console.log('interval is done, redirecting')
      if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
      }
      emits('gotobot', props.botId)
    }
  }, 1000)
}

const stopCountdown = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
    // console.log('Countdown stopped')
  }
}

// Watch for changes in the condition
watch(
  shouldStartCountdown,
  (newValue, oldValue) => {
    // console.log('Countdown condition changed:', { from: oldValue, to: newValue })

    if (newValue) {
      startCountdown()
    } else {
      stopCountdown()
    }
  },
  { immediate: true },
) // immediate: true will run on component mount

onUnmounted(() => {
  // console.log('onUnmounted called')
  stopCountdown()
})
</script>

<template>
  <TopIconPopup
    :title="
      isTokenization
        ? status === 'success'
          ? 'All Set!'
          : 'Tokenization Failed'
        : status === 'success'
          ? 'Payment Success!'
          : 'Oops! Payment Failed!'
    "
    :closeBtnText="status !== 'success' ? 'Cancel' : ''"
    :confirmBtnText="!isTokenization ? (status === 'success' ? 'Go to Your Subscription' : '') : ''"
    :warningBtnText="!isTokenization ? (status !== 'success' ? 'Pay Now!' : '') : ''"
    v-if="resultPopupVisible"
    :isSuccess="status === 'success'"
    @close="onCancel"
    @confirm="status === 'success' ? onGoToSub() : onPayNow()"
  >
    <template #bodyContent v-if="isTokenization">
      <template v-if="status === 'success'">
        <div class="d-flex flex-column align-items-center">
          <span>We’ve saved your payment details safely.</span>
          <span>You're good to go!</span>

          <p class="mt-3 text-center">
            Your subscription will only start charging on
            {{ nextPayment && nextPayment != '-' ? formatToDate(new Date(nextPayment)) : '-' }}. You
            can unsubscribe anytime before the trial ends—no charges will be made.
          </p>

          <span> Redirecting you to <b>AI ChatBot</b> in {{ countdown }} s... </span>
        </div>
      </template>
      <template v-else>
        <span>Please try again</span>
      </template>
    </template>
    <template #bodyContent v-else>
      <template v-if="status == 'success'">
        <p>Your payment has been successfully done.</p>
      </template>
      <template v-else>
        <p>Payment could not be processed. Try again</p>
      </template>
      <!-- <div class="separator"></div> -->
      <hr class="w-100" />
      <template v-if="status == 'success'">
        <p class="text-muted">Total Payment</p>
      </template>
      <template v-else>
        <p class="text-muted">Total Payment Pending</p>
      </template>
      <h3 class="fw-bold mb-4">RM{{ totalPayment }}</h3>

      <template v-if="status == 'success'">
        <div class="row mb-4">
          <div class="col-6 mb-3">
            <div class="card d-flex flex-column align-items-start p-3 h-100 custom-card-style">
              <span class="text-muted medium-text">Ref Number</span>
              <span class="fw-600 medium-text">{{ refNumber }}</span>
            </div>
          </div>
          <div class="col-6 mb-3">
            <div class="card d-flex flex-column align-items-start p-3 h-100 custom-card-style">
              <span class="text-muted medium-text">Payment Time</span>
              <span class="fw-600 medium-text">{{
                paymentTime ? formatToDatetime2(new Date(paymentTime)) : '-'
              }}</span>
            </div>
          </div>

          <div class="col-6 mb-3">
            <div class="card d-flex flex-column align-items-start p-3 h-100 custom-card-style">
              <span class="text-muted medium-text">Payment Method</span>
              <span class="fw-600 medium-text">{{ paymentMethod }}</span>
            </div>
          </div>
          <!-- <div class="col-6 mb-3">
            <div class="card d-flex flex-column align-items-start p-3">
              <span class="text-muted medium-text">Sender Name</span>
              <span class="fw-600 medium-text">{{ senderName }}</span>
            </div>
          </div> -->
        </div>
      </template>
    </template>
  </TopIconPopup>
</template>

<style scoped>
.custom-card-style {
  min-height: 100px;
}
</style>
