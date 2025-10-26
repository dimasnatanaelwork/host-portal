<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import ResultPopup from './widgets/ResultPopup.vue'
import { useSubscription } from '@/composables/useSubscription'
import { useRouter } from 'vue-router'
import { useAiChatbot } from '@/composables/useAiChatbot'

const { loading, error, billingDetail, loadBillingDetail, subscribe } = useSubscription()
const router = useRouter()

const props = defineProps<{
  status: string
  orderUuid: string
}>()

const isTokenization = ref<boolean>(false)

onMounted(async () => {
  const res = await loadBillingDetail(props.orderUuid)

  if (res.status === 'success') {
    isTokenization.value = billingDetail.value?.payment_type === 'tokenize' ? true : false
  }
})

const resultPopupVisible = ref<boolean>(true)

const onCancel = () => {
  router.push({ name: 'Subscription' })
}

const onPayNow = async (botId: number) => {
  // try {
  //   const subRes = await subscribe(
  //     botId,
  //     billingDetail.value?.package_type == 'monthly' ? 'monthly' : 'yearly',
  //   )

  //   if (subRes.status === 'success') {
  //     window.open(subRes.data.payment_url, '_blank')
  //   }
  // } catch (error) {
  //   alert(error)
  // }
  router.push({ name: 'PlanNPricing', params: { botId: botId, mode: 'subscribe' } })
}

const onRedirectSub = (botId: number) => {
  router.push({ name: 'PlanNPricing', params: { botId: botId, mode: 'renew' } })
}

const onRedirectBot = (botId: number) => {
  router.push({ name: 'AiChatbotDetail', params: { id: botId } })
}
</script>

<template>
  <ResultPopup
    v-if="billingDetail"
    :botId="billingDetail.chatbot_id!"
    :status="status === 'paid' ? 'success' : 'failed'"
    :totalPayment="billingDetail.total_payment || '-'"
    :refNumber="billingDetail.uuid || '-'"
    :paymentTime="billingDetail.paid_at || ''"
    :paymentMethod="billingDetail.payment_method || '-'"
    :resultPopupVisible="resultPopupVisible"
    :isTokenization="isTokenization"
    :nextPayment="billingDetail.payment_due_date || '-'"
    @cancel="onCancel"
    @paynow="onPayNow"
    @gotosub="onRedirectSub"
    @gotobot="onRedirectBot"
  />
</template>
