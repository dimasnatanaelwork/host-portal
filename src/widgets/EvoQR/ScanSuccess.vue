<script setup lang="ts">
import HappyBot from '@/components/Icons/HappyBot.vue'
import Popup from '@/components/Popup/Popup.vue'

defineProps<{
  scanSuccessVisible: boolean
}>()

const emits = defineEmits<{
  (e: 'close'): void
}>()

const onClose = () => {
  emits('close')
}
</script>

<template>
  <Popup confirmBtnText="Close" v-if="scanSuccessVisible" @confirm="onClose" @close="onClose">
    <template #descriptions>
      <div class="d-flex flex-column align-items-center">
        <HappyBot />
        <h4>🎉 Janus WA Linked!</h4>
        <p>
          Awesome! Your Janus WA link is ready to go. Start chatting with your guests right away.
        </p>
      </div>
    </template>
  </Popup>
</template>
