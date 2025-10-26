<script lang="ts" setup>
import { defineEmits, computed, ref } from 'vue'
import BroadcastPopupIcon from '../Icons/BroadcastPopupIcon.vue'
import Multiselect from 'vue-multiselect'

export interface ScheduledMessageOptionModel {
  label: string
  value: any
}

const props = defineProps<{
  options: ScheduledMessageOptionModel[] | null
}>()

const emits = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', type_id: number | null, phone: string): void
}>()

function close() {
  emits('close')
}

const selectedOption = ref<number | null>(null)

const internalValue = computed({
  get: () => {
    return props.options?.find((opt) => opt.value === selectedOption.value) ?? null
  },
  set: (option) => {
    if (option) {
      selectedOption.value = option.value
    }
  },
})

const phoneNumberRef = ref('')

function onRunAction() {
  emits('confirm', selectedOption.value, phoneNumberRef.value)
}
</script>

<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <button class="close-btn" @click="close">×</button>
      <div class="icon-wrapper">
        <BroadcastPopupIcon />
      </div>
      <h2>Broadcast Message</h2>
      <p>
        Select a message to broadcast. Optionally enter a guest’s mobile number or Open ID to target
        a specific recipient.
      </p>
      <div class="mb-3 w-100">
        <label>Message*</label>
        <Multiselect
          v-model="internalValue"
          :options="options ?? []"
          :searchable="false"
          :close-on-select="true"
          :show-labels="false"
          :placeholder="'Choose an option'"
          label="label"
          track-by="value"
          class="custom-multiselect"
        />
      </div>
      <div class="mb-3 w-100 d-flex flex-column">
        <label for="phoneNum">Mobile Number</label>
        <input
          name="phoneNum"
          class="form-control"
          type="text"
          v-model="phoneNumberRef"
          placeholder="6016xxxxxxx"
        />
        <p>
          Enter the full number with country code (e.g. 6016xxxxxxx). If left empty, the message
          will be sent to the primary guest.
        </p>
      </div>
      <div class="actions">
        <button class="cancel-btn" @click="close">Cancel</button>
        <button class="run-btn" @click="onRunAction">Run Action</button>
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
