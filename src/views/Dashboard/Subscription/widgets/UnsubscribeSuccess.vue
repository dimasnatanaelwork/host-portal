<script lang="ts" setup>
import Popup from '@/components/Popup/Popup.vue'
import { formatToDDMMYYYY, toTitleCaseFromSnakeOrKebab } from '@/utils/utils'

const props = defineProps<{
  subsId: number
  chatbotName: string
  billingCycle: string
  lastActive: string
  // nextBillingDate: string
  status: string
  unsubSuccessPopupVisible: boolean
}>()

const emits = defineEmits<{
  (e: 'close', id: number): void // resubscribe
  (e: 'confirm'): void
}>()

const onClose = () => {
  emits('close', props.subsId) // resubscribe
}

const onConfirm = () => {
  emits('confirm')
}
</script>

<template>
  <Popup
    title="Plan Cancelled"
    closeBtnText="Re-Subscribe"
    confirmBtnText="OK!"
    v-if="unsubSuccessPopupVisible"
    type="success"
    @close="onClose"
    @confirm="onConfirm"
  >
    <template #descriptions>
      <p>You have successfully cancelled from this plan.</p>
      <ul>
        <li>Chatbot Name: {{ chatbotName }}</li>
        <li>Billing Cycle: {{ billingCycle }}</li>
        <li>Last Active: {{ lastActive ? formatToDDMMYYYY(new Date(lastActive)) : '-' }}</li>
        <li>Next Payment: Cancelled</li>
        <li>Status: {{ toTitleCaseFromSnakeOrKebab(status) }}</li>
      </ul>
      <p>
        You can re-subscribe to this plan anytime. Your data will be saved for the next 30 days.
      </p>
    </template>
  </Popup>
</template>
