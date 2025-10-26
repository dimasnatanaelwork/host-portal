<script setup lang="ts">
import Popup from '@/components/Popup/Popup.vue'

defineProps<{
  pauseResumeVisible: boolean
  title: string
  desc: string
  cancelText: string
  confText: string
}>()

const emits = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()

const onClose = () => {
  emits('close')
}
const onConfirm = () => {
  emits('confirm')
}
</script>

<template>
  <Popup
    v-if="pauseResumeVisible"
    @confirm="onConfirm"
    @close="onClose"
    :closeBtnText="cancelText"
    :confirmBtnText="confText"
  >
    <template #descriptions>
      <div class="d-flex flex-column align-items-center">
        <slot name="mainImg"></slot>
        <h4>{{ title }}</h4>
        <p class="text-center">
          {{ desc }}
        </p>
      </div>
    </template>
  </Popup>
</template>
