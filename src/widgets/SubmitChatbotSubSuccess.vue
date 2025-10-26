<script lang="ts" setup>
import Popup from '@/components/Popup/Popup.vue'

defineProps<{
  successPopupVisible: boolean
  hasChosenChannelManager: boolean
}>()

const emits = defineEmits<{
  (e: 'confim'): void
}>()

const onConfirm = () => {
  emits('confim')
}
</script>

<template>
  <Popup
    title="Chatbot created successfully."
    confirmBtnText="OK!"
    v-if="successPopupVisible"
    type="success"
    @confirm="onConfirm"
  >
    <template #descriptions v-if="hasChosenChannelManager">
      <p>
        Your chatbot is ready! Next is to submit payment method — don’t worry, no charges will be
        made before billing due date!
      </p>
    </template>
    <template #descriptions v-else>
      Your chatbot has been created. Please complete the integration setup to activate it.
    </template>
  </Popup>
</template>
