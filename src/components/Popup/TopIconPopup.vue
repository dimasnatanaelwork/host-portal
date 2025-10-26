<script lang="ts" setup>
import { defineEmits } from 'vue'
import PrimaryBtn from '../Buttons/PrimaryBtn.vue'
import WarningBtn from '../Buttons/WarningBtn.vue'
import SecondaryBtn from '../Buttons/SecondaryBtn.vue'
import TopPopupSuccessIcon from '../Icons/popup/TopPopupSuccessIcon.vue'
import TopPopupFailedIcon from '../Icons/popup/TopPopupFailedIcon.vue'

defineProps<{
  title: string
  isSuccess: boolean | null
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
      <template v-if="isSuccess != undefined && isSuccess != null">
        <div class="icon-wrapper">
          <template v-if="isSuccess">
            <TopPopupSuccessIcon />
          </template>
          <template v-else>
            <TopPopupFailedIcon />
          </template>
        </div>
      </template>
      <div class="d-flex flex-column align-items-center w-100 mt-3">
        <h2>{{ title }}</h2>
        <slot name="bodyContent"></slot>
      </div>
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

.icon-wrapper {
  position: absolute;
  top: -2.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: none;
  border: none;
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
