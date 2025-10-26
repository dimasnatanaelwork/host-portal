<script lang="ts" setup>
import FormInput from '@/components/Form/FormInput.vue'
import Popup from '@/components/Popup/Popup.vue'
import { useBooking } from '@/composables/useBooking'
import { useLoadingStore } from '@/stores/loadingStore'
import { watch } from 'vue'
import { ref, type Ref } from 'vue'

const props = defineProps<{
  syncPopupVisible: boolean
  property_id: number
}>()

const { loading, error, syncHotelBooking } = useBooking()
const loadingStore = useLoadingStore()
watch(loading, (newLoadingStatus) => {
  loadingStore.setLoading(newLoadingStatus)
})

type FormType = {
  booking_number: string
}

const form: Ref<FormType> = ref({
  booking_number: '',
})

const emits = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', isSuccess: boolean, errorMsg: string): void
}>()

const onClose = () => {
  emits('close')
}

// only to trigger close popup
const onConfirm = (isSuccess: boolean, errorMsg: string) => {
  emits('confirm', isSuccess, errorMsg)
}

const onTriggerSync = async () => {
  try {
    const res = await syncHotelBooking(props.property_id, form.value.booking_number)
    if (res.status !== 'success') {
      onConfirm(false, error.value!)
    } else {
      onConfirm(true, '')
    }
  } catch (err) {
    onConfirm(false, `Error submitting: ${err}`)
  }
}
</script>

<template>
  <Popup
    title="Sync A Booking"
    closeBtnText="Cancel"
    confirmBtnText="Run Action"
    v-if="syncPopupVisible"
    @close="onClose"
    @confirm="onTriggerSync"
  >
    <template #descriptions>
      <p class="small-text">Are you sure you want to run this action?</p>
    </template>
    <template #bodyContent>
      <FormInput
        class="my-3"
        title="OTA Booking Number / PMS Booking Number"
        placeholder="e.g. 12345678"
        type="text"
        v-model="form.booking_number"
        :labelTop="true"
      />
    </template>
  </Popup>
</template>
