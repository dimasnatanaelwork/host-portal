<script lang="ts" setup>
import { defineEmits } from 'vue'

defineProps<{
  imgUrl: string
  imgAlt: string
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
    <button class="close-btn" @click="close">×</button>
    <div class="modal-content mx-3">
      <img :src="imgUrl" :alt="imgAlt" class="w-100" />
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
  padding: 0.5rem;
  max-width: 600px;
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
  color: white;
}
</style>
