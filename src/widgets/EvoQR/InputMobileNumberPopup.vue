<script setup lang="ts">
import FormInput, { type ValidationRule } from '@/components/Form/FormInput.vue'
import Popup from '@/components/Popup/Popup.vue'
import { reactive, ref } from 'vue'

defineProps<{
  phonePopupVisible: boolean
}>()

const emits = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', phoneNumber: string): void
}>()

const form = reactive({
  mobile_no: '',
})

const onClose = () => {
  emits('close')
}

const onConfirm = () => {
  console.log('emitting confirm')
  emits('confirm', form.mobile_no)
}

const contactNumberRules: ValidationRule[] = [
  {
    type: 'regex',
    pattern: /^[0-9]+$/,
    message: 'Numerical only. ',
  },
]

const phoneNumberValid = ref(true)

function onPhoneNumberValidation(isValid: boolean, errors: string[] = []) {
  phoneNumberValid.value = isValid
}
</script>

<template>
  <Popup
    title="Link Your Phone Number"
    type="phone-num"
    closeBtnText="Cancel"
    confirmBtnText="Confirm"
    v-if="phonePopupVisible"
    @close="onClose"
    @confirm="onConfirm"
  >
    <template #descriptions>
      <p class="medium-text">
        Your phone number will be connected to the chatbot for automated guest messages, reminders,
        and conversations.
      </p>
      <div class="w-100 mb-3">
        <!-- <PhoneNumberInput
          :countryCode="form.country_code"
          :phoneNumber="form.mobile_no"
          @update:countryCode="(val) => (form.country_code = val)"
          @update:phoneNumber="(val) => (form.mobile_no = val)"
        /> -->
        <FormInput
          class="my-3"
          title="Phone"
          type="text"
          v-model="form.mobile_no"
          required
          :labelTop="true"
          :validation-rules="contactNumberRules"
          :validateOnInput="true"
          @validation-change="onPhoneNumberValidation"
        />
      </div>
      <p class="mb-0 medium-text">
        Once confirmed, a QR code will be generated for your scanning to complete the setup.
      </p>
    </template>
  </Popup>
</template>
