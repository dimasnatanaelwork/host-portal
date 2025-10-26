<script lang="ts" setup>
defineProps<{
  status: 'reminder' | 'warning'
  //   announcementText: string
  btnText: string
}>()

const emits = defineEmits<{
  (e: 'action'): void
  (e: 'close'): void
}>()

const onActionTrigger = () => {
  emits('action')
}

const onClose = () => {
  emits('close')
}
</script>

<template>
  <div
    class="announcement-container d-flex flex-row justify-content-between align-items-center px-3 py-2"
    :class="{ reminder: status === 'reminder', warning: status === 'warning' }"
  >
    <slot name="announcementContent"></slot>
    <div class="d-flex flex-row align-items-center gap-3">
      <!-- <button
        class="action-btn small-text fw-bold"
        @click.prevent="onActionTrigger"
        :class="{ reminder: status === 'reminder', warning: status === 'warning' }"
      >
        {{ btnText }}
      </button> -->
      <button class="close-btn" @click.prevent="onClose">x</button>
    </div>
  </div>
</template>

<style scoped>
.announcement-container {
  border-radius: 0.5rem;
}

.announcement-container.reminder {
  background-color: #273c8c;
}

.announcement-container.warning {
  background-color: #f15e61;
}

.action-btn {
  border: none;
  border-radius: 0.5rem;
  background-color: white;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.action-btn.reminder {
  color: #273c8c;
}

.action-btn.warning {
  color: #f15e61;
}

.close-btn {
  color: white;
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
}
</style>
