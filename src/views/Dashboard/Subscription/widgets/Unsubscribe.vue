<script lang="ts" setup>
import Popup from '@/components/Popup/Popup.vue'
import { formatToDDMMYYYY, toTitleCaseFromSnakeOrKebab } from '@/utils/utils'

const props = defineProps<{
  subsId: number
  chatbotName: string
  billingCycle: string
  nextBillingDate: string
  status: string
  unsubPopupVisible: boolean
}>()

const emits = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', id: number): void
}>()

const onClose = () => {
  emits('close')
}

const onConfirm = () => {
  emits('confirm', props.subsId)
}
</script>

<template>
  <Popup
    title="Confirm Cancel Plan?"
    warningBtnText="Yes, Unsubscribe"
    v-if="unsubPopupVisible"
    type="nonsuccess"
    @close="onClose"
    @confirm="onConfirm"
  >
    <template #descriptions>
      <p>You are about to cancel plan from the following plan :</p>
      <ul>
        <li>Chatbot Name: {{ chatbotName }}</li>
        <li>Billing Cycle: {{ billingCycle }}</li>
        <li>
          Next Billing Date:
          {{ nextBillingDate ? formatToDDMMYYYY(new Date(nextBillingDate)) : '-' }}
        </li>
        <li>Status: {{ toTitleCaseFromSnakeOrKebab(status) }}</li>
      </ul>
      <p>
        Once cancelled, you’ll lose access to this plan’s features after the expiry date. Your data
        will be retained for 30 days.
      </p>
    </template>
  </Popup>
</template>
