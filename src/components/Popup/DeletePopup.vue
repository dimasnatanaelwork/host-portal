<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'
import DeletePopupIcon from '../Icons/DeletePopupIcon.vue'

defineProps<{
  title: string
  message: string
}>()

const emits = defineEmits(['close', 'confirm'])

function close() {
  emits('close')
}

function confirmDelete() {
  emits('confirm')
}
</script>

<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <button class="close-btn" @click="close">×</button>
      <div class="icon-wrapper">
        <DeletePopupIcon />
      </div>
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <div class="actions">
        <button class="cancel-btn" @click="close">Cancel</button>
        <button class="delete-btn" @click="confirmDelete">Delete</button>
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
  max-width: 350px;
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
}
.delete-btn {
  background: #e53e3e;
  color: #fff;
  border: none;
  padding: 8px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}
.delete-btn:hover {
  background: #c53030;
}
</style>
