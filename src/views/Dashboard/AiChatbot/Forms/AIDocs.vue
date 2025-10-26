<script lang="ts" setup>
import { useRouter } from 'vue-router'
import FormInput, { type ExistingFileRef } from '@/components/Form/FormInput.vue'
import FormHeader from '@/components/Form/FormHeader.vue'
import { onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useAiChatbot } from '@/composables/useAiChatbot'
import { useLoadingStore } from '@/stores/loadingStore'
import { getFileName } from '@/utils/utils'
import { useFormSubmitMsgStore } from '@/stores/formSubmitMsg'

const router = useRouter()
const formSubmitMsgStore = useFormSubmitMsgStore()
const { loading, aiDocDetail, loadAiDoc, addAiDocument, editAiDocument } = useAiChatbot()

const loadingStore = useLoadingStore()
watch(loading, (newLoadingStatus) => {
  loadingStore.setLoading(newLoadingStatus)
})

const props = defineProps<{
  id: number
  mode: string
  chatbotId: number
  chatbotName: string
}>()

type FormType = {
  docName: string
  docPersona: string
  refFile: File | ExistingFileRef | null
}

const form: Ref<FormType> = ref({
  docName: '',
  docPersona: '',
  refFile: null as File | ExistingFileRef | null,
})

const formRef = ref<HTMLFormElement | null>(null)

onMounted(async () => {
  if (props.mode == 'edit') {
    await loadAiDoc(props.id)

    form.value.docName = aiDocDetail.value?.name!
    form.value.docPersona = aiDocDetail.value?.persona!

    if (aiDocDetail.value?.doc_url) {
      form.value.refFile = {
        name: getFileName(aiDocDetail.value.doc_url),
        url: aiDocDetail.value.doc_url,
        isExisting: true,
      } as ExistingFileRef
    }
  }
})

const onSubmitForm = async () => {
  if (formRef.value && !formRef.value.reportValidity()) {
    return
  }

  if (!form.value.refFile) {
    console.log('No file selected')
  }

  if (props.mode == 'add') {
    const res = await addAiDocument(
      props.chatbotId,
      form.value.docName,
      form.value.docPersona,
      form.value.refFile,
    )

    if (res.status_code != 422) {
      formSubmitMsgStore.setMessageStatus('addAiDocSuccess')
      router.back()
    } else {
      alert(res.msg)
    }
  } else {
    const res = await editAiDocument(
      props.chatbotId,
      props.id,
      form.value.docName,
      form.value.docPersona,
      form.value.refFile,
    )

    if (res.status_code != 422) {
      formSubmitMsgStore.setMessageStatus('editAiDocSuccess')
      router.back()
    } else {
      alert(res.msg)
    }
  }
}
</script>

<template>
  <div class="container">
    <FormHeader
      :formTitle="chatbotName"
      :formTypeTitle="(mode === 'edit' ? 'Edit' : 'Add New') + ' AI Files'"
      @submit="onSubmitForm"
    />
    <form ref="formRef" @submit.prevent="onSubmitForm">
      <FormInput
        class="my-3"
        title="Document Name"
        subtitle="Set name for your document"
        type="text"
        v-model="form.docName"
        :required="true"
      />
      <FormInput
        class="my-3"
        title="Document Persona"
        subtitle="Fill in AI persona for your document"
        type="textarea"
        v-model="form.docPersona"
        :textAreaLimit="150"
        :required="true"
      />
      <FormInput
        class="my-3"
        title="Reference File"
        subtitle="Attach file for content reference"
        type="file"
        v-model="form.refFile"
        :required="true"
        accept=".pdf,.jpeg,.jpg,.png,.mp4"
        :maxSizeMB="8"
      />
    </form>
  </div>
</template>
