<script lang="ts" setup>
import { useDashboardStore } from '@/stores/dashboardItems'
import { useRouter } from 'vue-router'
import FormInput, { type ValidationRule } from '@/components/Form/FormInput.vue'
import FormHeader from '@/components/Form/FormHeader.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useProperty } from '@/composables/useProperty'
import { useLoadingStore } from '@/stores/loadingStore'
import { useFormSubmitMsgStore } from '@/stores/formSubmitMsg'

const formSubmitMsgStore = useFormSubmitMsgStore()
const router = useRouter()

const { loading, error, propertyDetail, loadPropertyDetail, updatePropertyDetail } = useProperty()

const loadingStore = useLoadingStore()
watch(loading, (newLoadingStatus) => {
  loadingStore.setLoading(newLoadingStatus)
})

const props = defineProps<{
  id: number
  mode: string
}>()

const form = ref({
  personaName: '',
  bookingLink: '',
  contactNumber: '',
  address: '',
  email: '',
  latitude: '',
  longitude: '',
  checkinTime: '',
  checkoutTime: '',
  sendCheckinoutSummary: false,
})

const contactNumberRules: ValidationRule[] = [
  {
    type: 'regex',
    pattern: /^[0-9]+$/,
    message: 'Numerical only. ',
  },
]

const emailRules: ValidationRule[] = [
  {
    type: 'regex',
    pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
    message: 'Email must be a valid format (e.g. name@example.com).',
  },
]

const latitudeRules: ValidationRule[] = [
  {
    type: 'regex',
    pattern: /^-?\d+(\.\d+)?$/,
    message: 'Latitude must be a valid number.',
  },
  {
    type: 'custom',
    message: 'Latitude must be between -90 and 90.',
    validator: (value: any) => {
      const num = parseFloat(value)
      return !isNaN(num) && num >= -90 && num <= 90
    },
  },
]

const longitudeRules: ValidationRule[] = [
  {
    type: 'regex',
    pattern: /^-?\d+(\.\d+)?$/,
    message: 'Longitude must be a valid number.',
  },
  {
    type: 'custom',
    message: 'Longitude must be between -180 and 180.',
    validator: (value: any) => {
      const num = parseFloat(value)
      return !isNaN(num) && num >= -180 && num <= 180
    },
  },
]

const phoneNumberValid = ref(true)
const emailValid = ref(true)
const latitudeValid = ref(true)
const longitudeValid = ref(true)

function onPhoneNumberValidation(isValid: boolean, errors: string[] = []) {
  phoneNumberValid.value = isValid
}

function onEmailValidation(isValid: boolean, errors: string[] = []) {
  emailValid.value = isValid
}

function onLatValidation(isValid: boolean, errors: string[] = []) {
  latitudeValid.value = isValid
}

function onLongValidation(isValid: boolean, errors: string[] = []) {
  longitudeValid.value = isValid
}

const formRef = ref<HTMLFormElement | null>(null)

const isFormValid = computed(() => {
  return phoneNumberValid.value && emailValid.value && latitudeValid.value && longitudeValid.value
})

const onSubmitForm = async () => {
  if (!isFormValid.value) {
    // alert('Please fix validation errors before submitting')
    return
  }
  if (formRef.value && !formRef.value.reportValidity()) {
    return
  }

  const res = await updatePropertyDetail(
    props.id,
    form.value.personaName, // hotelName,
    form.value.bookingLink, //     hotelLink,
    form.value.contactNumber, //     mobileNumber,
    form.value.address, //     address,
    form.value.email, //     email,
    form.value.latitude, //     latitude,
    form.value.longitude, //     longtitude,
    form.value.checkinTime, //     checkinTime,
    form.value.checkoutTime, //     checkoutTime,
    form.value.sendCheckinoutSummary ? 1 : 0, //     sendToHost,
  )
  if (res.status_code != 422) {
    formSubmitMsgStore.setMessageStatus('editPropertyInfoSuccess')
    router.back()
  } else {
    alert(res.msg)
  }
}

onMounted(async () => {
  await loadPropertyDetail(props.id)

  if (propertyDetail.value?.hotel) {
    form.value.personaName = propertyDetail.value?.hotel.hotel_name
    form.value.bookingLink = propertyDetail.value?.hotel.hotel_link
    form.value.contactNumber = propertyDetail.value?.hotel.mobile_number
    form.value.address = propertyDetail.value?.hotel.address
    form.value.email = propertyDetail.value?.hotel.email
    form.value.latitude = propertyDetail.value?.hotel.latitude
    form.value.longitude = propertyDetail.value?.hotel.longtitude
    if (propertyDetail.value?.hotel.check_in_time) {
      form.value.checkinTime = propertyDetail.value.hotel.check_in_time.substring(0, 5)
    }
    if (propertyDetail.value?.hotel.check_out_time) {
      form.value.checkoutTime = propertyDetail.value.hotel.check_out_time.substring(0, 5)
    }
    form.value.sendCheckinoutSummary = propertyDetail.value?.hotel.send_to_host == 1
    console.log(form.value)
  }
})
</script>

<template>
  <div class="container">
    <FormHeader
      :formTitle="`Edit ${propertyDetail?.hotel.hotel_name}`"
      formTypeTitle="Edit Info"
      @submit="onSubmitForm"
    />
    <form ref="formRef" @submit.prevent="onSubmitForm">
      <FormInput
        class="my-3"
        title="Property Persona Name"
        subtitle="Set property name for your chatbot"
        type="text"
        v-model="form.personaName"
      />
      <FormInput
        class="my-3"
        title="Booking Link"
        subtitle="Set booking link for your chatbot"
        type="text"
        v-model="form.bookingLink"
      />
      <FormInput
        class="my-3"
        title="Property Contact Number"
        subtitle="Set phone number for your chatbot"
        type="text"
        v-model="form.contactNumber"
        :validation-rules="contactNumberRules"
        :validateOnInput="true"
        @validation-change="onPhoneNumberValidation"
      />
      <FormInput
        class="my-3"
        title="Property Address"
        subtitle="Set address for your chatbot"
        type="text"
        v-model="form.address"
      />
      <FormInput
        class="my-3"
        title="Property Contact Email"
        subtitle="Set email for your chatbot"
        type="text"
        v-model="form.email"
        :validation-rules="emailRules"
        :validateOnInput="true"
        @validation-change="onEmailValidation"
      />
      <FormInput
        class="my-3"
        title="Property Latitude"
        subtitle="Set latitude for your chatbot"
        type="text"
        v-model="form.latitude"
        :validation-rules="latitudeRules"
        :validateOnInput="true"
        @validation-change="onLatValidation"
      />
      <FormInput
        class="my-3"
        title="Property Longitude"
        subtitle="Set longitude for your chatbot"
        type="text"
        v-model="form.longitude"
        :validation-rules="longitudeRules"
        :validateOnInput="true"
        @validation-change="onLongValidation"
      />
      <FormInput
        class="my-3"
        title="Property Check-in Time"
        subtitle="Set check-in time for your chatbot"
        type="time"
        v-model="form.checkinTime"
      />
      <FormInput
        class="my-3"
        title="Property Check-out Time"
        subtitle="Set check-out time for your chatbot"
        type="time"
        v-model="form.checkoutTime"
      />
      <FormInput
        class="my-3"
        title="Send Daily Check In/Out Summary?"
        subtitle="Enable automatic reply to messages on the selected channel"
        type="checkbox"
        v-model="form.sendCheckinoutSummary"
      />
    </form>
  </div>
</template>
