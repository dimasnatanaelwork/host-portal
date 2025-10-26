<script lang="ts" setup>
import { defineEmits } from 'vue'
import PrimaryBtn from '../Buttons/PrimaryBtn.vue'
import WarningBtn from '../Buttons/WarningBtn.vue'
import PopupSuccessIcon from '../Icons/PopupSuccessIcon.vue'
import PopupErrorIcon from '../Icons/PopupErrorIcon.vue'
import SecondaryBtn from '../Buttons/SecondaryBtn.vue'
import ScanIcon from '../Icons/popup/ScanIcon.vue'
import PhoneNumIcon from '../Icons/popup/PhoneNumIcon.vue'

defineProps<{
  title?: string
  // isSuccess: boolean | null
  type?: 'success' | 'nonsuccess' | 'scan' | 'phone-num'
  closeBtnText?: string
  warningBtnText?: string
  confirmBtnText?: string
}>()

const emits = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()

function close() {
  emits('close')
}

function confirm() {
  emits('confirm')
}
</script>

<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <button class="close-btn" @click="close">×</button>
      <template v-if="type">
        <div class="icon-wrapper">
          <template v-if="type === 'success'">
            <PopupSuccessIcon />
          </template>
          <template v-else-if="type === 'nonsuccess'">
            <PopupErrorIcon />
          </template>
          <template v-else-if="type === 'scan'">
            <ScanIcon />
          </template>
          <template v-if="type === 'phone-num'">
            <PhoneNumIcon />
          </template>
        </div>
      </template>
      <h2 v-if="title">{{ title }}</h2>
      <slot name="descriptions"></slot>
      <slot name="bodyContent"></slot>
      <div class="actions mt-3">
        <template v-if="closeBtnText">
          <SecondaryBtn class="w-100" :btnText="closeBtnText" @click="close" />
        </template>
        <template v-if="confirmBtnText">
          <PrimaryBtn class="w-100" :btnText="confirmBtnText" @click="confirm" />
        </template>
        <template v-else-if="warningBtnText">
          <WarningBtn class="w-100" :btnText="warningBtnText" @click="confirm" />
        </template>
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
  flex-direction: row;
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
