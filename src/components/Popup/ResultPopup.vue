<script lang="ts" setup>
import { defineEmits } from 'vue'
import PopupSuccessIcon from '../Icons/PopupSuccessIcon.vue'
import PopupErrorIcon from '../Icons/PopupErrorIcon.vue'

defineProps<{
  title: string
  desc: string
  isSuccess: boolean
  closeBtnText?: string
  warningBtnText?: string
}>()

const emits = defineEmits<{
  (e: 'close'): void
}>()

function close() {
  emits('close')
}
</script>

<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <button class="close-btn" @click="close">×</button>
      <div class="icon-wrapper">
        <template v-if="isSuccess">
          <PopupSuccessIcon />
        </template>
        <template v-else>
          <PopupErrorIcon />
        </template>
      </div>
      <h2>{{ title }}</h2>
      <p>
        {{ desc }}
      </p>
      <div class="actions">
        <button class="run-btn" @click="close">{{ closeBtnText ?? 'OK!' }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}
.modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 32px 24px 24px 24px;
  max-width: 500px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: start;
}
.close-btn {
  position: absolute;
  top: 18px;
  right: 18px;
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
}
.icon-wrapper {
  margin-bottom: 12px;
}
.delete-icon {
  background: #ffeaea;
  color: #e53e3e;
  border-radius: 50%;
  padding: 14px;
  font-size: 28px;
  display: inline-block;
}
h2 {
  margin: 0 0 10px 0;
  font-size: 1.2em;
  font-weight: 600;
}
p {
  color: #555;
  margin-bottom: 24px;
}
.actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  width: 100%;
}
.cancel-btn {
  border: 1px solid #ccc;
  background: #fff;
  color: #333;
  padding: 8px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  width: 100%;
}
.run-btn {
  background: #273c8c;
  color: #fff;
  border: none;
  padding: 8px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  width: 100%;
}
.run-btn:hover {
  background: #0056b3;
}
</style>
