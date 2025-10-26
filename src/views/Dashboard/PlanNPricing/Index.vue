<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import PackageSelection from './widgets/PackageSelection.vue'
import PriceSummary, { type PaymentSummaryInterface } from './widgets/PriceSummary.vue'
import { useAiChatbot } from '@/composables/useAiChatbot'
import { useLoadingStore } from '@/stores/loadingStore'
import type { GridOption } from '@/interfaces/subscription'
import { useSubscription } from '@/composables/useSubscription'
import type { LabelValueOption } from '@/interfaces/general_interface'

const props = defineProps<{
  botId: number
  mode: 'subscribe' | 'renew'
}>()

const router = useRouter()
const loadingStore = useLoadingStore()
const { loading, error, aiChatbotList, loadAiChatbots, aiChatbotDetail, loadAiChatbotDetail } =
  useAiChatbot()
const { applyPromo } = useSubscription()

watch(loading, (newLoadingStatus) => {
  loadingStore.setLoading(newLoadingStatus)
})

const chatbotNames = ref<LabelValueOption[]>([])

const defaultGridOptions: GridOption[] = [
  {
    id: 1,
    price: `RM0/mth`,
    description: 'Monthly plan',
    billingItems: [],
  },
  {
    id: 2,
    price: `RM0/year`,
    description: 'Yearly plan',
    note: 'Free 2 months access',
    billingItems: [],
  },
]
const gridOptions = ref<GridOption[]>(defaultGridOptions)

const defaultPaymentSummary: PaymentSummaryInterface = {
  aibotId: 0,
  billingItems: [
    {
      label: 'Subscription Fee',
      value: '0.00',
    },
    {
      label: 'Add-Ons Service',
      value: '0.00',
    },
  ],
  isTrial: true,
  isTokenized: false,
  subTotal: '0.00',
  tax: 'NA',
  total: '0.00',
  billingDate: '',
  nextTotal: '0.00',
  nextBillingDate: '',
  type: 'monthly',
  // mode: 'subscribe',
  subscriptionStatus: 'pending_activation',
  expiredAt: '',
  existingCard: null,
  existingToken: null,
}
const paymentSummary = ref<PaymentSummaryInterface>(defaultPaymentSummary)

const chatbotId = ref<string>('')
const selectedPackage = ref<number>(1)

onMounted(async () => {
  const res = await loadAiChatbots()
  if (res.status_code === 401) {
    router.push('/')
  }
  if (aiChatbotList.value) {
    chatbotNames.value = aiChatbotList.value.ai_chatbots.map((chatbot) => ({
      label: chatbot.name,
      value: chatbot.id.toString(),
    }))
  }

  if (props.botId) {
    chatbotId.value = props.botId.toString()
  } else {
    chatbotId.value = aiChatbotList.value?.ai_chatbots[0].id.toString()!
  }
})

const resetData = () => {
  gridOptions.value = defaultGridOptions
  paymentSummary.value = defaultPaymentSummary
}

watch(
  chatbotId,
  async (chatbot_id) => {
    if (chatbot_id !== '') {
      const res = await loadAiChatbotDetail(Number(chatbot_id))

      if (res.data.ai_chatbot.billing_charges.length <= 0) {
        resetData()
        return
      }

      let monthlyPrice = ''
      let yearlyPrice = ''
      if (res.status === 'success' && res.data) {
        if (res.data.ai_chatbot.subscription.status !== 'pending_activation') {
          monthlyPrice = res.data.ai_chatbot.subscription_packages.monthly.recurring.sub_total
          yearlyPrice = res.data.ai_chatbot.subscription_packages.yearly.recurring.sub_total
        } else {
          monthlyPrice = res.data.ai_chatbot.subscription_packages.monthly.first_time.sub_total
          yearlyPrice = res.data.ai_chatbot.subscription_packages.yearly.first_time.sub_total
        }

        gridOptions.value = [
          {
            id: 1,
            price: `RM${monthlyPrice}/mth`,
            description: 'Monthly plan',
            billingItems: res.data.ai_chatbot.billing_charges,
          },
          {
            id: 2,
            price: `RM${yearlyPrice}/year`,
            description: 'Yearly plan',
            note: 'Free 2 months access',
            billingItems: res.data.ai_chatbot.yearly_billing_charges,
          },
        ]

        // set default selected package if exists
        setPriceSummary(1)
        if (aiChatbotDetail.value?.ai_chatbot.subscription.package_type) {
          // console.log('there is package type')
          if (aiChatbotDetail.value?.ai_chatbot.subscription.package_type === 'monthly') {
            // console.log('package is set to 1')
            selectedPackage.value = 1
            // setPriceSummary(1)
          } else if (aiChatbotDetail.value?.ai_chatbot.subscription.package_type === 'yearly') {
            // console.log('package is set to 2')
            selectedPackage.value = 2
            setPriceSummary(2)
          }
        }
      } else {
        resetData()
      }
    } else {
      resetData()
    }
  },
  { immediate: true },
)

watch(
  selectedPackage,
  (packageId) => {
    // console.log('price summary change is triggered')
    setPriceSummary(packageId)
  },
  // { immediate: true },
)

const setPriceSummary = (packageId: number) => {
  if (!aiChatbotDetail.value) return

  if (packageId === 1) {
    // console.log('price summary monthly')
    const billingItemList =
      aiChatbotDetail.value.ai_chatbot.billing_charges.length > 0
        ? aiChatbotDetail.value.ai_chatbot.billing_charges.map((bill) => ({
            label: bill.desc,
            value: bill.total_price,
          }))
        : defaultPaymentSummary.billingItems

    let monthlySubtotal = ''
    let monthlyTax = ''
    let monthlyTotal = ''
    let billingDate = ''

    if (
      aiChatbotDetail.value.ai_chatbot.subscription.status === 'pending_activation'
      // ||
      // aiChatbotDetail.value.ai_chatbot.subscription.is_trial
    ) {
      monthlySubtotal =
        aiChatbotDetail.value.ai_chatbot.subscription_packages.monthly.first_time.sub_total ??
        '0.00'
      monthlyTax =
        aiChatbotDetail.value.ai_chatbot.subscription_packages.monthly.first_time.sst ?? '0.00'
      monthlyTotal =
        aiChatbotDetail.value.ai_chatbot.subscription_packages.monthly.first_time.total ?? '0.00'
      billingDate =
        aiChatbotDetail.value.ai_chatbot.subscription_packages.monthly.first_time.charge_at
    } else {
      monthlySubtotal =
        aiChatbotDetail.value.ai_chatbot.subscription_packages.monthly.recurring.sub_total ?? '0.00'
      monthlyTax =
        aiChatbotDetail.value.ai_chatbot.subscription_packages.monthly.recurring.sst ?? '0.00'
      monthlyTotal =
        aiChatbotDetail.value.ai_chatbot.subscription_packages.monthly.recurring.total ?? '0.00'
      billingDate = aiChatbotDetail.value.ai_chatbot.subscription.next_billing_at
    }

    paymentSummary.value = {
      aibotId: aiChatbotDetail.value.ai_chatbot.id,
      billingItems: billingItemList,
      isTrial: aiChatbotDetail.value.ai_chatbot.subscription.is_trial == 1,
      isTokenized:
        aiChatbotDetail.value.ai_chatbot.subscription.twoc2p_card_token &&
        aiChatbotDetail.value.ai_chatbot.subscription.twoc2p_card_token != ''
          ? true
          : false,
      subTotal: monthlySubtotal,
      tax: monthlyTax,
      total: monthlyTotal,
      billingDate: billingDate, // aiChatbotDetail.value.ai_chatbot.subscription_packages.monthly.first_time.charge_at,
      nextTotal: aiChatbotDetail.value.ai_chatbot.subscription_packages.monthly.recurring.total,
      nextBillingDate:
        aiChatbotDetail.value.ai_chatbot.subscription_packages.monthly.recurring.charge_at,
      type: 'monthly',
      // mode: props.mode,
      subscriptionStatus: aiChatbotDetail.value.ai_chatbot.subscription.status,
      expiredAt: aiChatbotDetail.value.ai_chatbot.subscription.expired_at,
      existingCard: aiChatbotDetail.value.ai_chatbot.subscription.twoc2p_card_no,
      existingToken: aiChatbotDetail.value.ai_chatbot.subscription.twoc2p_card_token,
    }
  } else if (packageId === 2) {
    // console.log('price summary yearly')
    const billingItemList =
      aiChatbotDetail.value.ai_chatbot.yearly_billing_charges.length > 0
        ? aiChatbotDetail.value.ai_chatbot.yearly_billing_charges.map((bill) => ({
            label: bill.desc,
            value: bill.total_price,
          }))
        : defaultPaymentSummary.billingItems

    let yearlySubtotal = ''
    let yearlyTax = ''
    let yearlyTotal = ''

    // if (props.mode === 'renew') {
    //   yearlySubtotal =
    //     aiChatbotDetail.value.ai_chatbot.subscription_packages.yearly.recurring.sub_total ?? '0.00'
    //   yearlyTax =
    //     aiChatbotDetail.value.ai_chatbot.subscription_packages.yearly.recurring.sst ?? '0.00'
    //   yearlyTotal =
    //     aiChatbotDetail.value.ai_chatbot.subscription_packages.yearly.recurring.total ?? '0.00'
    // } else {
    yearlySubtotal =
      aiChatbotDetail.value.ai_chatbot.subscription_packages.yearly.first_time.sub_total ?? '0.00'
    yearlyTax =
      aiChatbotDetail.value.ai_chatbot.subscription_packages.yearly.first_time.sst ?? '0.00'
    yearlyTotal =
      aiChatbotDetail.value.ai_chatbot.subscription_packages.yearly.first_time.total ?? '0.00'
    // }

    paymentSummary.value = {
      aibotId: aiChatbotDetail.value.ai_chatbot.id,
      billingItems: billingItemList,
      isTrial: aiChatbotDetail.value.ai_chatbot.subscription.is_trial == 1,
      isTokenized:
        aiChatbotDetail.value.ai_chatbot.subscription.twoc2p_card_token &&
        aiChatbotDetail.value.ai_chatbot.subscription.twoc2p_card_token != ''
          ? true
          : false,
      subTotal: yearlySubtotal,
      tax: yearlyTax,
      total: yearlyTotal,
      billingDate:
        aiChatbotDetail.value.ai_chatbot.subscription_packages.yearly.first_time.charge_at,
      nextTotal: aiChatbotDetail.value.ai_chatbot.subscription_packages.yearly.recurring.total,
      nextBillingDate:
        aiChatbotDetail.value.ai_chatbot.subscription_packages.yearly.recurring.charge_at,
      type: 'yearly',
      // mode: props.mode,
      subscriptionStatus: aiChatbotDetail.value.ai_chatbot.subscription.status,
      expiredAt: aiChatbotDetail.value.ai_chatbot.subscription.expired_at,
      existingCard: aiChatbotDetail.value.ai_chatbot.subscription.twoc2p_card_no,
      existingToken: aiChatbotDetail.value.ai_chatbot.subscription.twoc2p_card_token,
    }
  }
}

async function handleApplyPromo(promoCode: string) {
  try {
    const res = await applyPromo(promoCode, paymentSummary.value.aibotId)
    if (res.status === 'success') {
      const subscription = res.data.subscription
      const packageType = paymentSummary.value.type // 'monthly' or 'yearly'
      const mode = props.mode // 'subscribe' or 'renew'

      if (packageType === subscription.subscription.package_type) {
        // Determine which package detail to use based on mode
        const currentPackageDetail =
          // mode === 'subscribe'
          //   ?
          subscription.subscription_package.first_time
        // : subscription.subscription_package.recurring
        const nextPackageDetail = subscription.subscription_package.recurring

        // Update billing items from subscription.billing_charges
        const billingItems = subscription.billing_charges.map((bill: any) => ({
          label: bill.desc,
          value: bill.total_price,
        }))

        // Update paymentSummary
        paymentSummary.value = {
          ...paymentSummary.value,
          billingItems,
          subTotal: currentPackageDetail.sub_total,
          tax: currentPackageDetail.sst,
          total: currentPackageDetail.total,
          nextTotal: nextPackageDetail.total,
          billingDate: currentPackageDetail.charge_at,
          nextBillingDate: nextPackageDetail.charge_at,
        }
      }

      // // Determine which package detail to use based on mode
      // const currentPackageDetail =
      //   mode === 'subscribe'
      //     ? subscription.subscription_package[packageType].first_time
      //     : subscription.subscription_package[packageType].recurring
      // const nextPackageDetail = subscription.subscription_package[packageType].recurring

      // // Update billing items from subscription.billing_charges
      // const billingItems = subscription.billing_charges.map((bill: any) => ({
      //   label: bill.desc,
      //   value: bill.total_price,
      // }))

      // // Update paymentSummary
      // paymentSummary.value = {
      //   ...paymentSummary.value,
      //   billingItems,
      //   subTotal: currentPackageDetail.sub_total,
      //   tax: currentPackageDetail.sst,
      //   total: currentPackageDetail.total,
      //   nextTotal: nextPackageDetail.total,
      //   billingDate: currentPackageDetail.charge_at,
      //   nextBillingDate: nextPackageDetail.charge_at,
      // }
    } else {
      // Handle error - you might want to show a toast or alert
      alert(res.msg || 'Failed to apply promo code')
    }
  } catch (error) {
    alert('An error occurred while applying promo code')
  }
}
</script>

<template>
  <div class="container py-3">
    <!-- <template v-if="mode == 'renew'">
      <h3 class="my-0">Plan Renewal</h3>
      <span class="medium-text">
        Ensure continued access to all Janus features. Renew now and avoid service disruption.
      </span>
    </template> -->
    <!-- <template v-else> -->
    <h3 class="my-0">Janus Service Plan</h3>
    <span class="medium-text">Only pay for what your business needed.</span>
    <!-- </template> -->

    <div class="row mt-3">
      <div class="col-12 col-lg-7 mb-3">
        <PackageSelection
          :key="chatbotId"
          :chatbotNameValue="chatbotId"
          :selectedPackageValue="selectedPackage"
          :chatbotNames="chatbotNames"
          :currentActivePackage="
            aiChatbotDetail?.ai_chatbot.subscription.package_type
              ? aiChatbotDetail?.ai_chatbot.subscription.package_type === 'monthly'
                ? 1
                : 2
              : 0
          "
          :hasActivePackage="
            aiChatbotDetail?.ai_chatbot.subscription.package_type !== null &&
            aiChatbotDetail?.ai_chatbot.subscription.status === 'active'
          "
          :gridOptions="gridOptions"
          :properties="aiChatbotDetail?.hotels ?? []"
          @update:chatbotNameValue="(value) => (chatbotId = value)"
          @update:selectedPackageValue="(value) => (selectedPackage = value)"
        /><!--:mode="mode"-->
      </div>
      <div class="col-12 col-lg-5">
        <PriceSummary :paymentSummary="paymentSummary" @apply-promo="handleApplyPromo" />
      </div>
    </div>
  </div>
</template>
