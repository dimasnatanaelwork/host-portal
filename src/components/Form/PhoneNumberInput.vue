<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  countryCode: string
  phoneNumber: string
}>()

const emit = defineEmits<{
  (e: 'update:countryCode', value: string): void
  (e: 'update:phoneNumber', value: string): void
}>()

function onCountryCodeChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  emit('update:countryCode', value)
}

function onPhoneNumberChange(event: Event) {
  const value = (event.target as HTMLInputElement).value
  emit('update:phoneNumber', value)
}
</script>

<template>
  <label class="block mb-2 font-medium text-gray-700">Phone</label>
  <div class="row">
    <div class="col-2" style="padding-right: 0 !important">
      <select :value="props.countryCode" @change="onCountryCodeChange" class="form-control">
        <option v-for="code in ['60', '62', '65', '66', '1', '44']" :key="code" :value="code">
          +{{ code }}
        </option>
      </select>
    </div>
    <div class="col-10">
      <input
        :value="props.phoneNumber"
        @input="onPhoneNumberChange"
        type="tel"
        minlength="8"
        class="form-control"
      />
    </div>
  </div>
</template>
