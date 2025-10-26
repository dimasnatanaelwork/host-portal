<script lang="ts" setup>
import type { TableHeader } from '@/components/Table/Table.vue'
import Table from '@/components/Table/Table.vue'
import { useSubscription } from '@/composables/useSubscription'
import Unsubscribe from './Unsubscribe.vue'
import UnsubscribeSuccess from './UnsubscribeSuccess.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const { unsubscribe, subscribe, loadMySubscriptions } = useSubscription()

export interface SubsTableContent {
  subs_id: number
  name: string
  subscription_status: string
  is_trial: boolean
  is_paused: boolean
  expired_at: string
  total_unit: number
  subscription_next_billing_at: string
  package_type: string
}

defineProps<{
  subsTableContent: SubsTableContent[]
}>()

const subsTableHeader: TableHeader[] = [
  { label: 'Chatbot Name', key: 'name', type: 'longtext' },
  { label: 'Subscription Status', key: 'subscription_status', type: 'subscription_status' },
  { label: 'Due Date', key: 'expired_at', type: 'date' },
  { label: 'Active Units', key: 'total_unit' },
  { label: 'Next Billing', key: 'subscription_next_billing_at', type: 'date' },
]

interface EmitEvents {
  (e: 'create-chatbot'): void
  (e: 'refreshSubscriptions'): void
}

const emit = defineEmits<EmitEvents>()

const triggerCreateChatbot = () => {
  emit('create-chatbot')
}

const unsubPopupVisible = ref<boolean>(false)
const unsubSuccessPopupVisible = ref<boolean>(false)
const toBeUnsubscribed = ref<SubsTableContent | null>(null)

const onRenew = (row: SubsTableContent) => {
  router.push({ name: 'PlanNPricing', params: { botId: row.subs_id, mode: 'renew' } })
}

const onSub = (row: SubsTableContent) => {
  router.push({ name: 'PlanNPricing', params: { botId: row.subs_id, mode: 'subscribe' } })
}

const onUnsub = (row: SubsTableContent) => {
  toBeUnsubscribed.value = row
  unsubPopupVisible.value = true
}

const onConfirmUnsubscribe = async (subsId: number) => {
  try {
    const res = await unsubscribe(subsId)
  } catch (error) {
    alert(error)
  } finally {
    unsubPopupVisible.value = false
    unsubSuccessPopupVisible.value = true
  }
}

const onCloseSuccessPopup = () => {
  unsubSuccessPopupVisible.value = false
  emit('refreshSubscriptions')
}

const onResubscribe = (subsId: number) => {
  unsubSuccessPopupVisible.value = false
  router.push({ name: 'PlanNPricing', params: { botId: subsId, mode: 'subscribe' } })
}

const onPayNow = async (row: SubsTableContent) => {
  // try {
  //   const subRes = await subscribe(
  //     row.subs_id,
  //     row.package_type === 'monthly' ? 'monthly' : 'yearly',
  //   )

  //   if (subRes.status === 'success') {
  //     window.open(subRes.data.payment_url, '_blank')
  //   }
  // } catch (error) {
  //   alert(error)
  // }
  router.push({ name: 'PlanNPricing', params: { botId: row.subs_id, mode: 'subscribe' } })
}
</script>

<template>
  <Unsubscribe
    v-if="unsubPopupVisible && toBeUnsubscribed"
    :subsId="toBeUnsubscribed.subs_id"
    :chatbotName="toBeUnsubscribed.name"
    :billingCycle="toBeUnsubscribed.package_type"
    :nextBillingDate="toBeUnsubscribed.subscription_next_billing_at"
    :status="toBeUnsubscribed.subscription_status"
    :unsubPopupVisible="unsubPopupVisible"
    @close="unsubPopupVisible = false"
    @confirm="onConfirmUnsubscribe"
  />
  <UnsubscribeSuccess
    v-if="unsubSuccessPopupVisible && toBeUnsubscribed"
    :subsId="toBeUnsubscribed.subs_id"
    :chatbotName="toBeUnsubscribed.name"
    :billingCycle="toBeUnsubscribed.package_type"
    :lastActive="toBeUnsubscribed.expired_at"
    :status="toBeUnsubscribed.subscription_status"
    :unsubSuccessPopupVisible="unsubSuccessPopupVisible"
    @close="onResubscribe"
    @confirm="onCloseSuccessPopup"
  />
  <Table
    :headers="subsTableHeader"
    :rows="subsTableContent"
    noDataMsg="You don’t have any active subscriptions at the moment. To start using our services, please create a ChatBot"
    noDataBtnTxt="Create a Chatbot"
    :hasEdit="false"
    :hasView="false"
    :hasBroadcast="false"
    :hasSync="false"
    :hasDelete="false"
    :hasSubscriptionButtons="true"
    @no-data-func="triggerCreateChatbot"
    @renew="onRenew"
    @unsubscribe="onUnsub"
    @subscribe="onSub"
    @pay-now="onPayNow"
  />
</template>
