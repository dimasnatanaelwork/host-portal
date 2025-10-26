<script lang="ts" setup>
import { useRouter } from 'vue-router'
import FormInput, {
  type ExistingFileRef,
  type ValidationRule,
} from '@/components/Form/FormInput.vue'
import FormHeader from '@/components/Form/FormHeader.vue'
import { computed, onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useProperty } from '@/composables/useProperty'
import { useLoadingStore } from '@/stores/loadingStore'
import { getFileName } from '@/utils/utils'
import { useFormSubmitMsgStore } from '@/stores/formSubmitMsg'
import BackArrowIcon from '@/components/Icons/BackArrowIcon.vue'
import SecondaryBtn from '@/components/Buttons/SecondaryBtn.vue'
import PrimaryBtn from '@/components/Buttons/PrimaryBtn.vue'

const formSubmitMsgStore = useFormSubmitMsgStore()
const router = useRouter()

const {
  loading,
  error,
  propertyDetail,
  scheduledMessageDetail,
  scheduledMessageTypes,
  loadScheduledMessage,
  makeScheduleMessage,
  changeScheduleMessage,
  loadPropertyDetail,
  fetchScheduledMessageTypes,
} = useProperty()

const loadingStore = useLoadingStore()
watch(loading, (newLoadingStatus) => {
  loadingStore.setLoading(newLoadingStatus)
})

const props = defineProps<{
  id: number
  mode: string
  botType: string
  schedMsgId: number
}>()

type FormType = {
  templateName: string
  header: string
  msgType: string
  scheduledTiming: string
  msgContent: string
  fileAttachment: File | ExistingFileRef | null
  sendCheckinInstruction: boolean
  resendMsg: boolean
}

const templateNameRules: ValidationRule[] = [
  // {
  //   type: 'required',
  //   message: 'Template name is required. ',
  // },
  {
    type: 'regex',
    pattern: /^[a-z0-9_]+$/,
    message: 'Use lowercase letters, numbers, and underscores only. ',
  },
  {
    type: 'regex',
    // Fix regex to disallow spaces anywhere (no spaces allowed)
    pattern: /^\S*$/,
    message: 'No spaces allowed. ',
  },
  // {
  //   type: 'minLength',
  //   minLength: 3,
  //   message: 'Must be at least 3 characters long. ',
  // },
  // {
  //   type: 'maxLength',
  //   maxLength: 50,
  //   message: 'Cannot exceed 50 characters. ',
  // },
  // {
  //   type: 'custom',
  //   validator: (value: string): boolean =>
  //     !!value && !value.startsWith('_') && !value.endsWith('_'),
  //   message: 'Cannot start or end with underscore. ',
  // },
  {
    type: 'custom',
    validator: (value: string): boolean => {
      if (!value) return true // allow empty, let 'required' handle it
      return !value.startsWith('_') && !value.endsWith('_')
    },
    message: 'Cannot start or end with underscore.',
  },
]

const templateNameValid = ref(true)

// Event handlers for validation changes
function onTemplateNameValidation(isValid: boolean, errors: string[] = []) {
  // console.log('triggered validating . . . => ', isValid)
  templateNameValid.value = isValid
  // console.log('Template name validation:', { isValid, errors })
}

const form: Ref<FormType> = ref({
  templateName: '',
  header: '',
  msgType: '',
  scheduledTiming: '',
  msgContent: '',
  fileAttachment: null as File | ExistingFileRef | null,
  sendCheckinInstruction: false,
  resendMsg: false,
})

const formRef = ref<HTMLFormElement | null>(null)

onMounted(async () => {
  await loadPropertyDetail(props.id)
  if (props.mode == 'edit') {
    await loadScheduledMessage(props.schedMsgId)

    let time = ''
    if (scheduledMessageDetail.value?.send_at) {
      let timeArr = scheduledMessageDetail.value?.send_at.split(':')
      time = timeArr[0] + ':' + timeArr[1]
    }

    form.value.templateName = scheduledMessageDetail.value?.title!
    form.value.msgType = scheduledMessageDetail.value?.message_type.type!
    form.value.scheduledTiming = time
    form.value.msgContent = scheduledMessageDetail.value?.content!
    form.value.sendCheckinInstruction =
      scheduledMessageDetail.value?.send_checkin_instruction == 1 ? true : false
    form.value.resendMsg = scheduledMessageDetail.value?.handle_late_booking == 1 ? true : false
    if (scheduledMessageDetail.value?.doc_url) {
      form.value.fileAttachment = {
        name: getFileName(scheduledMessageDetail.value.doc_url),
        url: scheduledMessageDetail.value.doc_url,
        isExisting: true,
      } as ExistingFileRef
    }
  }

  await fetchScheduledMessageTypes()
})

const removeFile = ref<boolean>(false)

const isFormValid = computed(() => {
  return templateNameValid.value //&& messageContentValid.value
})

// waba / evo
const handleSubmit = async (status: string) => {
  // console.log('submitting : ', isFormValid.value)
  if (!isFormValid.value) {
    // alert('Please fix validation errors before submitting')
    return
  }
  if (formRef.value && !formRef.value.reportValidity()) {
    return
  }
  if (props.mode == 'add') {
    const res = await makeScheduleMessage(
      props.id,
      form.value.templateName,
      form.value.msgContent,
      form.value.msgType,
      form.value.scheduledTiming,
      form.value.fileAttachment,
      status,
      form.value.sendCheckinInstruction == true ? 1 : 0,
      form.value.resendMsg == true ? 1 : 0,
    )
    if (res.status_code != 422) {
      formSubmitMsgStore.setMessageStatus('addScheduledMsgSuccess')
      router.back()
    } else {
      alert(res.msg)
    }
  } else {
    if (!form.value.fileAttachment) {
      removeFile.value = true
    } else {
      removeFile.value = false
    }

    const res = await changeScheduleMessage(
      props.schedMsgId,
      form.value.templateName,
      form.value.msgContent,
      form.value.msgType,
      form.value.scheduledTiming,
      form.value.fileAttachment,
      status,
      removeFile.value,
      form.value.sendCheckinInstruction == true ? 1 : 0,
      form.value.resendMsg == true ? 1 : 0,
    )
    if (res.status_code != 422) {
      formSubmitMsgStore.setMessageStatus('editScheduledMsgSuccess')
      router.back()
    } else {
      alert(res.msg)
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="form-header-container">
      <div class="d-flex flex-row align-items-center my-3">
        <a @click="router.back()">
          <BackArrowIcon />
        </a>
        <h4 class="my-0 mx-3">{{ 'Edit ' + propertyDetail?.hotel.hotel_name! }} ></h4>
        <h4 class="my-0" style="font-style: italic">
          {{ (mode === 'edit' ? 'Edit' : 'Create') + ' Template' }}
        </h4>
      </div>
      <div class="d-flex flex-row justify-content-end">
        <div class="my-2">
          <SecondaryBtn @click="router.back()" />
        </div>
        <div class="my-2 ms-3">
          <SecondaryBtn @click="handleSubmit('draft')" btnText="Save as Draft" />
        </div>
        <div class="my-2 ms-3">
          <PrimaryBtn
            @click="handleSubmit('active')"
            :btnText="botType == 'WABA' ? 'Submit to META' : 'Submit'"
          />
        </div>
      </div>
    </div>
    <form ref="formRef" @submit.prevent="handleSubmit('active')">
      <div class="form-container mt-4">
        <FormInput
          class="my-3"
          title="Template Name"
          subtitle="Set name for your template"
          type="text"
          hint="Use lowercase letters only, no spaces, only _ allowed. Example: check_in_reminder_1"
          v-model="form.templateName"
          :validation-rules="templateNameRules"
          :validateOnInput="true"
          @validation-change="onTemplateNameValidation"
          required
        />

        <FormInput
          class="my-3"
          title="Message Type"
          subtitle="Select type of template"
          type="dropdown"
          v-model="form.msgType"
          :options="scheduledMessageTypes?.schedule_messsage_types"
          required
        />
        <template
          v-if="
            form.msgType !== 'RECEIVE_BOOKING_RECORD' &&
            form.msgType !== 'RECEIVE_BOOKING_CANCELED' &&
            form.msgType !== 'ID_DOC_RECEIVED' &&
            form.msgType !== 'CAR_PLATE_RECEIVED' &&
            form.msgType !== 'ID_CAR_PLATE_RECEIVED' &&
            form.msgType !== 'CHECKOUT_DOC_RECEIVED'
          "
        >
          <!-- <FormInput
            class="my-3"
            title="Scheduled Timing (24 Hours)"
            subtitle="Set schedule timing for message sending"
            hint="GMT+8"
            type="time"
            v-model="form.scheduledTiming"
            required
          /> -->
          <FormInput
            class="my-3"
            title="Scheduled Timing (24 Hours)"
            subtitle="Set schedule timing for message sending"
            type="dropdown"
            v-model="form.scheduledTiming"
            :options="[
              { label: '12:00 AM', value: '00:00' },
              { label: '12:15 AM', value: '00:15' },
              { label: '12:30 AM', value: '00:30' },
              { label: '12:45 AM', value: '00:45' },
              { label: '1:00 AM', value: '01:00' },
              { label: '1:15 AM', value: '01:15' },
              { label: '1:30 AM', value: '01:30' },
              { label: '1:45 AM', value: '01:45' },
              { label: '2:00 AM', value: '02:00' },
              { label: '2:15 AM', value: '02:15' },
              { label: '2:30 AM', value: '02:30' },
              { label: '2:45 AM', value: '02:45' },
              { label: '3:00 AM', value: '03:00' },
              { label: '3:15 AM', value: '03:15' },
              { label: '3:30 AM', value: '03:30' },
              { label: '3:45 AM', value: '03:45' },
              { label: '4:00 AM', value: '04:00' },
              { label: '4:15 AM', value: '04:15' },
              { label: '4:30 AM', value: '04:30' },
              { label: '4:45 AM', value: '04:45' },
              { label: '5:00 AM', value: '05:00' },
              { label: '5:15 AM', value: '05:15' },
              { label: '5:30 AM', value: '05:30' },
              { label: '5:45 AM', value: '05:45' },
              { label: '6:00 AM', value: '06:00' },
              { label: '6:15 AM', value: '06:15' },
              { label: '6:30 AM', value: '06:30' },
              { label: '6:45 AM', value: '06:45' },
              { label: '7:00 AM', value: '07:00' },
              { label: '7:15 AM', value: '07:15' },
              { label: '7:30 AM', value: '07:30' },
              { label: '7:45 AM', value: '07:45' },
              { label: '8:00 AM', value: '08:00' },
              { label: '8:15 AM', value: '08:15' },
              { label: '8:30 AM', value: '08:30' },
              { label: '8:45 AM', value: '08:45' },
              { label: '9:00 AM', value: '09:00' },
              { label: '9:15 AM', value: '09:15' },
              { label: '9:30 AM', value: '09:30' },
              { label: '9:45 AM', value: '09:45' },
              { label: '10:00 AM', value: '10:00' },
              { label: '10:15 AM', value: '10:15' },
              { label: '10:30 AM', value: '10:30' },
              { label: '10:45 AM', value: '10:45' },
              { label: '11:00 AM', value: '11:00' },
              { label: '11:15 AM', value: '11:15' },
              { label: '11:30 AM', value: '11:30' },
              { label: '11:45 AM', value: '11:45' },
              { label: '12:00 PM', value: '12:00' },
              { label: '12:15 PM', value: '12:15' },
              { label: '12:30 PM', value: '12:30' },
              { label: '12:45 PM', value: '12:45' },
              { label: '1:00 PM', value: '13:00' },
              { label: '1:15 PM', value: '13:15' },
              { label: '1:30 PM', value: '13:30' },
              { label: '1:45 PM', value: '13:45' },
              { label: '2:00 PM', value: '14:00' },
              { label: '2:15 PM', value: '14:15' },
              { label: '2:30 PM', value: '14:30' },
              { label: '2:45 PM', value: '14:45' },
              { label: '3:00 PM', value: '15:00' },
              { label: '3:15 PM', value: '15:15' },
              { label: '3:30 PM', value: '15:30' },
              { label: '3:45 PM', value: '15:45' },
              { label: '4:00 PM', value: '16:00' },
              { label: '4:15 PM', value: '16:15' },
              { label: '4:30 PM', value: '16:30' },
              { label: '4:45 PM', value: '16:45' },
              { label: '5:00 PM', value: '17:00' },
              { label: '5:15 PM', value: '17:15' },
              { label: '5:30 PM', value: '17:30' },
              { label: '5:45 PM', value: '17:45' },
              { label: '6:00 PM', value: '18:00' },
              { label: '6:15 PM', value: '18:15' },
              { label: '6:30 PM', value: '18:30' },
              { label: '6:45 PM', value: '18:45' },
              { label: '7:00 PM', value: '19:00' },
              { label: '7:15 PM', value: '19:15' },
              { label: '7:30 PM', value: '19:30' },
              { label: '7:45 PM', value: '19:45' },
              { label: '8:00 PM', value: '20:00' },
              { label: '8:15 PM', value: '20:15' },
              { label: '8:30 PM', value: '20:30' },
              { label: '8:45 PM', value: '20:45' },
              { label: '9:00 PM', value: '21:00' },
              { label: '9:15 PM', value: '21:15' },
              { label: '9:30 PM', value: '21:30' },
              { label: '9:45 PM', value: '21:45' },
              { label: '10:00 PM', value: '22:00' },
              { label: '10:15 PM', value: '22:15' },
              { label: '10:30 PM', value: '22:30' },
              { label: '10:45 PM', value: '22:45' },
              { label: '11:00 PM', value: '23:00' },
              { label: '11:15 PM', value: '23:15' },
              { label: '11:30 PM', value: '23:30' },
              { label: '11:45 PM', value: '23:45' },
            ]"
            required
          />
        </template>
      </div>
      <div class="form-container my-4">
        <FormInput
          class="my-3"
          title="Send Check-in instructions"
          subtitle="Check this to send the file uploaded in room details."
          type="checkbox"
          v-model="form.sendCheckinInstruction"
        />
        <FormInput
          class="my-3"
          title="Media Sample"
          subtitle="Attach file to your template"
          type="file"
          v-model="form.fileAttachment"
          accept=".pdf,.jpeg,.jpg,.png,.mp4"
          :maxSizeMB="8"
        />
        <FormInput
          class="my-3"
          title="Body"
          subtitle="Content for your exact message to be sent"
          type="textarea"
          v-model="form.msgContent"
          :textAreaLimit="800"
          required
        />
        <div class="row">
          <div class="col-3"></div>
          <div class="col-9">
            <div class="row">
              <div class="col-12 col-md-6 d-flex flex-column">
                <span class="guide-title small-text">Common Keywords</span>
                <span class="guide-content small-text">
                  :name = Guest name<br />
                  :hotel = Hotel name<br />
                  :bookingNumber = Booking Number<br />
                  :checkin_time = Checkin Date with Time<br />
                  :checkout_time = Checkout Date with Time<br />
                  :checkin_date = Checkin Date<br />
                  :checkout_date = Checkout Date<br />
                  :status = Booking Status
                </span>
              </div>
              <div class="col-12 col-md-6 d-flex flex-column">
                <!-- <span class="guide-title small-text"> Conditional Keywords</span> -->
                <span class="guide-content small-text">
                  :link = Concierge page (if applicable)<br />
                  :room = Room Number<br />
                  :pin = Smartlock pin (if applicable)<br />
                  :securitybox_password = Room number with its Passcode<br />
                  :unit_remark = Unit remark message<br />
                  :platform = Property Management System / Channel Manager<br />
                  :OTA = online booking site
                </span>
              </div>
            </div>
          </div>
        </div>
        <FormInput
          class="my-3"
          title="Send Message for Late Booking"
          subtitle="Automatically send scheduled message if a booking is late and misses the scheduled time."
          type="checkbox"
          v-model="form.resendMsg"
        />
      </div>
      <div class="content-container mb-4" v-if="botType == 'WABA'">
        <div class="d-flex flex-column m-3">
          <span class="title medium-text">WABA Message Template</span>
          <span class="small-text fst-italic">For META review submission purpose.</span>
        </div>
        <hr />
        <div class="d-flex flex-column m-3">
          <div class="medium-text">
            <div class="row">
              <div class="col-3 fw-600">Template Name</div>
              <div class="col-9">{{ scheduledMessageDetail?.meta_info.template_name ?? '-' }}</div>
            </div>
            <div class="row">
              <div class="col-3 fw-600">Template ID</div>
              <div class="col-9">{{ scheduledMessageDetail?.meta_info.template_id ?? '-' }}</div>
            </div>
            <div class="row">
              <div class="col-3 fw-600">Status</div>
              <div class="col-9">
                {{ scheduledMessageDetail?.meta_info.template_status ?? '-' }}
              </div>
            </div>
            <div class="row">
              <div class="col-3 fw-600">Category</div>
              <div class="col-9">
                {{ scheduledMessageDetail?.meta_info.template_category ?? '-' }}
              </div>
            </div>
            <div class="row">
              <div class="col-3 fw-600">Template Message</div>
              <div class="col-9">{{ scheduledMessageDetail?.meta_info.template_msg ?? '-' }}</div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-header-container {
  display: flex;
  flex-direction: column;
}

@media (min-width: 1024px) {
  .form-header-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}

.form-container {
  border: 1px solid #ccc;
  border-radius: 1rem;
  width: 100%;
  padding: 0.75rem 1.5rem;
}

.content-container {
  border: 1px solid #ccc;
  border-radius: 1rem;
}

.title {
  font-weight: 600;
}

.guide-title {
  color: #f15e61;
  font-weight: 600;
}

.guide-content {
  color: #f15e61;
}
</style>
