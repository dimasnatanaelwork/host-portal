<script lang="ts" setup>
import PrimaryBtn from '@/components/Buttons/PrimaryBtn.vue'
import PrimaryCustomBtn from '@/components/Buttons/PrimaryCustomBtn.vue'
import SecondaryCustomBtn from '@/components/Buttons/SecondaryCustomBtn.vue'
import AlertTriangleIcon from '@/components/Icons/AlertTriangleIcon.vue'
import FPXIcon from '@/components/Icons/ButtonIcons/FPXIcon.vue'
import MastercardIcon from '@/components/Icons/ButtonIcons/MastercardIcon.vue'
import VisaIcon from '@/components/Icons/ButtonIcons/VisaIcon.vue'
import { useSubscription } from '@/composables/useSubscription'
import type { LabelValueOption } from '@/interfaces/general_interface'
import { useLoadingStore } from '@/stores/loadingStore'
import {
  formatToDate,
  formatToDDMMYYYY,
  obscureText,
  toTitleCaseFromSnakeOrKebab,
} from '@/utils/utils'
import { computed, watch } from 'vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { loading, error, subscribe, makeOneTimePayment } = useSubscription()
const loadingStore = useLoadingStore()
watch(loading, (newLoadingStatus) => {
  loadingStore.setLoading(newLoadingStatus)
})

export interface PaymentSummaryInterface {
  aibotId: number
  billingItems: LabelValueOption[]
  isTrial: boolean
  isTokenized: boolean
  subTotal: string
  tax: string
  total: string
  billingDate: string
  nextTotal: string
  nextBillingDate: string
  type: 'monthly' | 'yearly'
  // mode: 'subscribe' | 'renew'
  subscriptionStatus: 'active' | 'inactive' | 'paused' | 'pending_activation' | 'pending_payment'
  expiredAt: string
  existingCard: string | null
  existingToken: string | null
}

const props = defineProps<{
  paymentSummary: PaymentSummaryInterface
}>()

const emits = defineEmits<{ (e: 'apply-promo', promo_code: string): void }>()

const promoCode = ref('')
const promoError = ref<string | null>(null)
const promoApplied = ref(false)

function applyPromo() {
  if (!promoCode.value) return
  promoError.value = null
  emits('apply-promo', promoCode.value)
}

const accepted = ref(false)

async function onContinueTokenize() {
  if (!accepted.value) return
  try {
    const subRes = await subscribe(props.paymentSummary.aibotId, props.paymentSummary.type)

    if (subRes.status === 'success') {
      window.open(subRes.data.payment_url, '_blank')
    }
  } catch (error) {
    alert(error)
  }
}

async function onContinueOneTimePay() {
  if (!accepted.value) return
  try {
    const subRes = await makeOneTimePayment(props.paymentSummary.aibotId, props.paymentSummary.type)

    if (subRes.status === 'success') {
      window.open(subRes.data.payment_url, '_blank')
    }
  } catch (error) {
    alert(error)
  }
}

const billingComputation = computed(() => {
  const today = new Date()
  const billingDate = new Date(props.paymentSummary.billingDate)
  const expiredDate = new Date(props.paymentSummary.expiredAt)

  const diffTimeBilling = billingDate.getTime() - today.getTime()
  const diffDaysBilling = Math.floor(diffTimeBilling / (1000 * 60 * 60 * 24))

  const diffTimeExp = expiredDate.getTime() - today.getTime()
  const diffDaysExp = Math.floor(diffTimeExp / (1000 * 60 * 60 * 24))

  return {
    daysUntilBill: diffDaysBilling,
    daysUntilExp: diffDaysExp,
  }
})
</script>

<template>
  <div class="card py-3 px-4">
    <!-- show billing charges only to first time users -->
    <template v-if="paymentSummary.subscriptionStatus === 'pending_activation'">
      <div
        class="mb-3 d-flex justify-content-between"
        v-for="billingItem in paymentSummary.billingItems"
      >
        <span class="label-style">{{ billingItem.label }}</span>
        <strong>RM{{ billingItem.value }}</strong>
      </div>
      <div class="d-flex justify-content-between">
        <span class="label-style">Service Tax (6%)</span>
        <span>{{ paymentSummary.tax == 'NA' ? '' : 'RM' }}{{ paymentSummary.tax }}</span>
      </div>
      <!-- promo code section -->
      <div class="mt-3">
        <div class="d-flex align-items-center gap-2">
          <input
            v-model="promoCode"
            type="text"
            class="form-control"
            placeholder="Enter promo code"
            :disabled="promoApplied"
          />
          <PrimaryBtn @click="applyPromo" btnText="Apply" />
        </div>
        <small v-if="promoError" class="text-danger">{{ promoError }}</small>
        <small v-if="promoApplied" class="text-success">Promo code applied successfully!</small>
      </div>
      <hr />
      <div class="d-flex justify-content-between mb-2">
        <strong class="label-style">Total</strong>
        <strong>RM{{ paymentSummary.total }}</strong>
      </div>
    </template>

    <!-- else, show alternative ui detailing package and payment details -->
    <template v-else>
      <div class="mb-3 d-flex justify-content-between">
        <span class="label-style">Plan</span>
        <strong
          >RM{{ paymentSummary.total
          }}{{ paymentSummary.type == 'monthly' ? '/month' : '/year' }}</strong
        >
      </div>
      <div class="mb-3 d-flex justify-content-between align-items-center">
        <div class="status-icon-container">
          <span class="label-style">Status</span>
          <AlertTriangleIcon
            class="ms-1"
            v-if="paymentSummary.subscriptionStatus === 'pending_payment'"
          />
        </div>

        <strong>{{ toTitleCaseFromSnakeOrKebab(paymentSummary.subscriptionStatus) }}</strong>
      </div>
      <div
        class="mb-3 d-flex justify-content-between"
        v-if="paymentSummary.expiredAt && billingComputation.daysUntilExp <= 0"
      >
        <span class="label-style">Subscription Ended</span>
        <strong>{{ formatToDDMMYYYY(new Date(paymentSummary.expiredAt)) }}</strong>
      </div>
      <div
        class="mb-3 d-flex justify-content-between"
        v-if="paymentSummary.existingCard && paymentSummary.existingToken"
      >
        <span class="label-style">Payment Method</span>
        <span>{{ obscureText(paymentSummary.existingCard) }}</span>
      </div>

      <template v-if="paymentSummary.subscriptionStatus === 'pending_payment'">
        <div
          class="card d-flex align-items-center justify-content-center p-3 bg-danger mt-3 border-0"
        >
          <p class="small-text text-center mb-0 text-light">
            This subscription has an outstanding payment. Please retry or change your payment method
            to avoid service interruption.
          </p>
        </div>
      </template>
    </template>

    <div class="text-center my-3">
      <template v-if="paymentSummary.subscriptionStatus === 'pending_activation'">
        <p class="mb-1">First Payment After Trial Ends</p>
      </template>
      <template v-else-if="paymentSummary.subscriptionStatus === 'pending_payment'">
        <p class="mb-1">Total due now</p>
      </template>
      <template v-else-if="paymentSummary.subscriptionStatus === 'active'">
        <!-- <template v-if="billingComputation.daysUntilBill > 7">
          <p class="mb-1">Next billing date</p>
        </template>
        <template v-else> -->
        <p class="mb-1">Total next billing</p>
        <!-- </template> -->
      </template>
      <template v-else>
        <p class="mb-1">Total Need to Pay</p>
      </template>

      <!-- show date if there's an active package and billing date is more than 7 days -->
      <!-- <template
        v-if="
          paymentSummary.subscriptionStatus === 'active' && billingComputation.daysUntilBill > 7
        "
      >
        <h3 class="fw-bold mb-1">
          {{
            paymentSummary.billingDate
              ? formatToDDMMYYYY(new Date(paymentSummary.billingDate))
              : '-'
          }}
        </h3>
      </template> -->

      <!-- else, show the amount to pay -->
      <!-- <template v-else> -->
      <h3 class="fw-bold mb-1">RM{{ paymentSummary.total }}</h3>
      <small
        class="text-muted"
        v-if="Number(paymentSummary.total) !== 0 && paymentSummary.billingDate"
      >
        billed on {{ formatToDate(new Date(paymentSummary.billingDate)) }}
      </small>
      <!-- </template> -->

      <!-- only show for new users, or if the subscription has become inactive -->
      <template
        v-if="
          paymentSummary.subscriptionStatus === 'pending_activation' &&
          Number(paymentSummary.total) !== 0 &&
          paymentSummary.nextTotal &&
          paymentSummary.nextBillingDate
        "
      >
        <p class="fw-600 mt-4 mb-0">Next Payment: {{ paymentSummary.nextTotal }}</p>
        <small class="text-muted">
          on {{ formatToDate(new Date(paymentSummary.nextBillingDate)) }}
        </small>
      </template>
    </div>

    <!-- only show if inactive, or if billing date is nearing -->
    <!-- <template v-if="paymentSummary.subscriptionStatus !== 'active'"> -->
    <div class="mb-3 d-flex align-items-center justify-content-center">
      <label class="custom-checkbox">
        <input type="checkbox" v-model="accepted" />
        <span class="checkmark"></span>
      </label>
      <label for="terms" class="form-check-label ms-2" style="font-size: 14px">
        I have understand and accept the
        <a
          href="https://web.janustech.co/terms-and-conditions/"
          target="_blank"
          rel="noopener noreferrer"
          @click.stop
          class="primary-color"
          >Term & Conditions,</a
        >
        <br />
        <a
          href="https://web.janustech.co/cancellation-refund-policy/"
          target="_blank"
          rel="noopener noreferrer"
          @click.stop
          class="primary-color"
          >Refund & Payment Policy</a
        >
      </label>
    </div>

    <template
      v-if="
        paymentSummary.subscriptionStatus === 'pending_activation' &&
        Number(paymentSummary.total) !== 0
      "
    >
      <p style="font-size: 14px; line-height: 1.4; color: #333; text-align: center">
        By <b>proceeding with the payment method</b>, you are confirming the details of your plan.
        No payment will be charged at this time; we will only process your billing after final steps
        confirmation. You have the option to cancel your plan at any time before your billing date.
      </p>
    </template>
    <!-- </template> -->

    <!-- if active and billing date's more than 7, no need to trigger pay manually -->
    <!-- <template
      v-if="paymentSummary.subscriptionStatus === 'active' && billingComputation.daysUntilBill > 7"
    >
      <PrimaryCustomBtn @click="router.push('/subscription')">
        <template #customBtnText>
          <div class="d-flex flex-row align-items-center justify-content-center">
            <span>Manage Subscription</span>
          </div>
        </template>
      </PrimaryCustomBtn>

      <SecondaryCustomBtn class="mt-2" @click="router.push('/billing')">
        <template #customBtnText>
          <div class="d-flex flex-row align-items-center justify-content-center">
            <span>View Billing History</span>
          </div>
        </template>
      </SecondaryCustomBtn>

      <p class="mt-3 text-center small-text">
        Receipts available in Billing History. Cancel plan anytime from Manage Subscription
      </p>
    </template> -->

    <PrimaryCustomBtn
      @click="onContinueOneTimePay"
      :disabled="!accepted || Number(paymentSummary.total) <= 0"
    >
      <template #customBtnText>
        <div class="d-flex flex-row align-items-center justify-content-center">
          <span>Pay Now</span>
        </div>
      </template>
    </PrimaryCustomBtn>

    <SecondaryCustomBtn
      class="mt-2"
      @click="onContinueTokenize"
      :disabled="!accepted || Number(paymentSummary.total) <= 0 || paymentSummary.isTokenized"
    >
      <template #customBtnText>
        <div class="d-flex flex-row align-items-center justify-content-center">
          <span>Auto Debit</span>
        </div>
      </template>
    </SecondaryCustomBtn>

    <template
      v-if="paymentSummary.subscriptionStatus === 'active' && billingComputation.daysUntilBill <= 7"
    >
      <p class="mt-3 text-center small-text">
        You may choose to renew early. Your subscription cycle will remain unchanged — the next
        30-day period will begin on your scheduled billing date.
      </p>
    </template>
    <template v-else-if="paymentSummary.subscriptionStatus === 'pending_payment'">
      <p class="mt-3 text-center small-text">
        Your new cycle will start immediately from the payment date.
      </p>
    </template>
  </div>
</template>

<style scoped>
a {
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
  cursor: pointer;
}

.custom-checkbox {
  position: relative;
  display: inline-block;
  cursor: pointer;
  user-select: none;
  padding-left: 28px;
  font-size: 14px;
  line-height: 1.5;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.custom-checkbox .checkmark {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 20px;
  width: 20px;
  background-color: white;
  border: 2px solid #ced4da;
  border-radius: 50%;
  transition:
    background-color 0.3s,
    border-color 0.3s;
}

.custom-checkbox input:checked + .checkmark {
  background-color: #273c8c;
  border-color: #273c8c;
}

.custom-checkbox input:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 12px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  border-radius: 1px;
}

.custom-checkbox:hover .checkmark {
  border-color: #273c8c;
}

.label-style {
  color: #5c5e64;
  max-width: 50%;
}

.status-icon-container {
  display: flex;
  flex: auto;
  align-items: center;
}
</style>
