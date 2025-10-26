<script lang="ts" setup>
import { useRouter } from 'vue-router'
import FormInput, { type ExistingFileRef } from '@/components/Form/FormInput.vue'
import FormHeader from '@/components/Form/FormHeader.vue'
import { ref, onMounted, watch } from 'vue'
import type { Ref } from 'vue'
import { useProperty } from '@/composables/useProperty'
import { getFileName } from '@/utils/utils'
import { useLoadingStore } from '@/stores/loadingStore'
import { useFormSubmitMsgStore } from '@/stores/formSubmitMsg'

const formSubmitMsgStore = useFormSubmitMsgStore()
const router = useRouter()
const { loading, error, hotelRoomDetail, loadHotelRoom, changeHotelRoomDetail } = useProperty()

const loadingStore = useLoadingStore()
watch(loading, (newLoadingStatus) => {
  loadingStore.setLoading(newLoadingStatus)
})

const props = defineProps<{
  id: number
  mode: string
  roomId: number
}>()

type FormType = {
  roomNumber: string
  securityBoxPwd: string
  roomPersona: string
  remark: string
  instructionDoc: File | ExistingFileRef | null
}

const form: Ref<FormType> = ref({
  roomNumber: '',
  securityBoxPwd: '',
  roomPersona: '',
  remark: '',
  instructionDoc: null as File | ExistingFileRef | null,
})

const formRef = ref<HTMLFormElement | null>(null)

onMounted(async () => {
  if (props.mode == 'edit') {
    await loadHotelRoom(props.id, props.roomId)

    form.value.roomNumber = hotelRoomDetail.value?.room_number!
    form.value.securityBoxPwd = hotelRoomDetail.value?.securitybox_password!
    form.value.roomPersona = hotelRoomDetail.value?.openai_persona!
    form.value.remark = hotelRoomDetail.value?.remark!

    if (hotelRoomDetail.value?.checkin_instruction_doc_url) {
      form.value.instructionDoc = {
        name: getFileName(hotelRoomDetail.value.checkin_instruction_doc_url),
        url: hotelRoomDetail.value.checkin_instruction_doc_url,
        isExisting: true,
      } as ExistingFileRef
    }
  }
})

const onSubmitForm = async () => {
  if (formRef.value && !formRef.value.reportValidity()) {
    return
  }

  const res = await changeHotelRoomDetail(
    props.id,
    props.roomId,
    form.value.securityBoxPwd,
    form.value.roomPersona,
    form.value.remark,
    form.value.instructionDoc,
  )
  if (res.status_code != 422) {
    formSubmitMsgStore.setMessageStatus('editRoomSuccess')
    router.back()
  } else {
    alert(res.msg)
  }
}
</script>

<template>
  <div class="container">
    <FormHeader
      :formTitle="hotelRoomDetail?.room_number!"
      :formTypeTitle="(mode === 'edit' ? 'Edit' : 'Add New') + ' Room'"
      @submit="onSubmitForm"
    />
    <form ref="formRef" @submit.prevent="onSubmitForm">
      <FormInput
        class="my-3"
        title="Room Number"
        subtitle=""
        type="text"
        v-model="form.roomNumber"
        disabled
      />
      <FormInput
        class="my-3"
        title="Security Box Password"
        subtitle="Select password for your security box"
        type="text"
        v-model="form.securityBoxPwd"
      />
      <FormInput
        class="my-3"
        title="Room Persona"
        subtitle="Complete your AI persona with key room details like mailbox access, Wi-Fi info, room amenities and everything guests need to know about the space."
        type="textarea"
        v-model="form.roomPersona"
        :textAreaLimit="750"
      />
      <FormInput
        class="my-3"
        title="Remark"
        subtitle="For AI to send out the message with the specific unit remark"
        type="textarea"
        v-model="form.remark"
        :textAreaLimit="1350"
      />

      <FormInput
        class="my-3"
        title="Instruction Document"
        subtitle="Attach file to your message"
        type="file"
        v-model="form.instructionDoc"
        accept=".pdf,.jpeg,.jpg,.png,.mp4"
        :maxSizeMB="8"
      />
    </form>
  </div>
</template>
