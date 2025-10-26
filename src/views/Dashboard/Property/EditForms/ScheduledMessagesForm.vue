<script lang="ts" setup>
// import { useRouter } from 'vue-router'
// import FormInput, { type ExistingFileRef } from '@/components/Form/FormInput.vue'
// import FormHeader from '@/components/Form/FormHeader.vue'
// import { onMounted, ref, watch } from 'vue'
// import type { Ref } from 'vue'
// import { useProperty } from '@/composables/useProperty'
// import { useLoadingStore } from '@/stores/loadingStore'
// import { getFileName } from '@/utils/utils'
// import { useFormSubmitMsgStore } from '@/stores/formSubmitMsg'

// const formSubmitMsgStore = useFormSubmitMsgStore()
// const router = useRouter()

// const {
//   loading,
//   error,
//   propertyDetail,
//   scheduledMessageDetail,
//   loadScheduledMessage,
//   makeScheduleMessage,
//   changeScheduleMessage,
//   loadPropertyDetail,
// } = useProperty()

// const loadingStore = useLoadingStore()
// watch(loading, (newLoadingStatus) => {
//   loadingStore.setLoading(newLoadingStatus)
// })

// const props = defineProps<{
//   id: number
//   mode: string
//   schedMsgId: number
// }>()

// type FormType = {
//   msgTitle: string
//   msgType: string
//   scheduledTiming: string
//   msgContent: string
//   fileAttachment: File | ExistingFileRef | null
// }

// const form: Ref<FormType> = ref({
//   msgTitle: '',
//   msgType: '',
//   scheduledTiming: '',
//   msgContent: '',
//   fileAttachment: null as File | ExistingFileRef | null,
// })

// const formRef = ref<HTMLFormElement | null>(null)

// onMounted(async () => {
//   await loadPropertyDetail(props.id)
//   if (props.mode == 'edit') {
//     await loadScheduledMessage(props.schedMsgId)

//     form.value.msgTitle = scheduledMessageDetail.value?.title!
//     form.value.msgType = scheduledMessageDetail.value?.message_type.type!
//     form.value.scheduledTiming = scheduledMessageDetail.value?.send_at!
//     form.value.msgContent = scheduledMessageDetail.value?.content!
//     if (scheduledMessageDetail.value?.doc_url) {
//       form.value.fileAttachment = {
//         name: getFileName(scheduledMessageDetail.value.doc_url),
//         url: scheduledMessageDetail.value.doc_url,
//         isExisting: true,
//       } as ExistingFileRef
//     }
//   }
// })

// const onSubmitForm = async () => {
//   if (formRef.value && !formRef.value.reportValidity()) {
//     return
//   }

//   if (props.mode == 'add') {
//     const res = await makeScheduleMessage(
//       props.id,
//       form.value.msgTitle,
//       form.value.msgContent,
//       form.value.msgType,
//       form.value.scheduledTiming,
//       form.value.fileAttachment,
//     )

//     if (res.status_code != 422) {
//       formSubmitMsgStore.setMessageStatus('addScheduledMsgSuccess')
//       router.back()
//     } else {
//       alert(res.msg)
//     }
//   } else {
//     const res = await changeScheduleMessage(
//       props.schedMsgId,
//       form.value.msgTitle,
//       form.value.msgContent,
//       form.value.msgType,
//       form.value.scheduledTiming,
//       form.value.fileAttachment,
//     )
//     if (res.status_code != 422) {
//       formSubmitMsgStore.setMessageStatus('editScheduledMsgSuccess')
//       router.back()
//     } else {
//       alert(res.msg)
//     }
//   }
// }
</script>

<template>
  <!-- <div class="container">
    <FormHeader
      :formTitle="propertyDetail?.hotel.hotel_name!"
      :formTypeTitle="(mode === 'edit' ? 'Edit' : 'Add New') + ' Scheduled Message'"
      @submit="onSubmitForm"
    />
    <form ref="formRef" @submit.prevent="onSubmitForm">
      <FormInput
        title="Message Title"
        subtitle="Set title for your message"
        type="text"
        v-model="form.msgTitle"
        required
      />
      <FormInput
        title="Message Type"
        subtitle="Select message type"
        type="dropdown"
        v-model="form.msgType"
        :options="[
          { label: 'Check-out Date', value: 'CHECKOUT_D' },
          { label: 'Check-in Date', value: 'CHECKIN_D' },
          { label: 'A day before Check-in', value: 'DAY_BEFORE_CHECKIN' },
          { label: 'A day before Check-out', value: 'DAY_BEFORE_CHECKOUT' },
          { label: 'When Receive booking record', value: 'RECEIVE_BOOKING_RECORD' },
        ]"
        required
      />
      <FormInput
        title="Scheduled Timing (24 Hours)"
        subtitle="Set schedule timing for message sending"
        type="time"
        v-model="form.scheduledTiming"
        required
      />
      <FormInput
        title="Message Content"
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
              <span class="guide-title small-text"> Conditional Keywords</span>
              <span class="guide-content small-text">
                :link = Checkout link / Checkin link / payment link / default: Hotel link<br />
                :room = Room Number<br />
                :pin = Room Pin<br />
                :securitybox_password = Room number with its Passcode<br />
                :unit_remark = Unit remark message
              </span>
            </div>
          </div>
        </div>
      </div>
      <FormInput
        title="File Attachment"
        subtitle="Attach file to your message"
        type="file"
        v-model="form.fileAttachment"
        accept=".pdf,.jpeg,.jpg,.png,.mp4"
        :maxSizeMB="8"
      />
    </form>
  </div> -->
</template>

<style scoped>
.guide-title {
  color: #f15e61;
  font-weight: 600;
}

.guide-content {
  color: #f15e61;
}
</style>
