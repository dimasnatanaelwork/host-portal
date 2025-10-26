<script lang="ts" setup>
import { useRouter } from 'vue-router'
import FormInput from '@/components/Form/FormInput.vue'
import FormHeader from '@/components/Form/FormHeader.vue'
import { onMounted, ref, watch } from 'vue'
import { useAiChatbot } from '@/composables/useAiChatbot'
import { useLoadingStore } from '@/stores/loadingStore'
import { useFormSubmitMsgStore } from '@/stores/formSubmitMsg'

const formSubmitMsgStore = useFormSubmitMsgStore()
const router = useRouter()

const { loading, aiChatbotDetail, loadAiChatbotDetail, updatePersona } = useAiChatbot()

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
  aiPersona: '',
  personaTemperature: '',
  queryRoomRate: false,
})

const formRef = ref<HTMLFormElement | null>(null)

onMounted(async () => {
  await loadAiChatbotDetail(props.id)

  form.value.personaName = aiChatbotDetail.value?.ai_chatbot.name!
  form.value.aiPersona = aiChatbotDetail.value?.ai_chatbot.openai_persona!
  form.value.personaTemperature = aiChatbotDetail.value?.ai_chatbot.openai_temperature!
  form.value.queryRoomRate = aiChatbotDetail.value?.ai_chatbot.query_room_rate! == 1 ? true : false
})

const onSubmitForm = async () => {
  if (formRef.value && !formRef.value.reportValidity()) {
    return
  }

  const res = await updatePersona(props.id, {
    name: form.value.personaName,
    openAiPersona: form.value.aiPersona,
    openaiTemperature: form.value.personaTemperature,
    queryRoomRate: form.value.queryRoomRate ? 1 : 0,
  })
  if (res.status_code != 422) {
    formSubmitMsgStore.setMessageStatus('editAiPersonaSuccess')
    router.back()
  } else {
    alert(res.msg)
  }
}
</script>

<template>
  <div class="container">
    <FormHeader
      :formTitle="`Edit ${aiChatbotDetail?.ai_chatbot.name}`"
      formTypeTitle="Edit Persona"
      @submit="onSubmitForm"
    />
    <form ref="formRef" @submit.prevent="onSubmitForm">
      <FormInput
        class="my-3"
        title="Chatbot Name"
        subtitle="Set property name for your chatbot"
        type="text"
        v-model="form.personaName"
      />
      <FormInput
        class="my-3"
        title="AI Persona"
        subtitle="Central guideline for how this chatbot should represent the business"
        type="textarea"
        v-model="form.aiPersona"
        :textAreaLimit="6500"
      />
      <!-- <FormInput
        title="Response Directness"
        subtitle="Adjusts how creative or serious thechatbot replies are."
        type="slider-select"
        v-model="form.personaTemperature"
        :slider-options="[
          { value: 0.2, label: '0.2', description: 'Very focused and deterministic' },
          { value: 0.5, label: '0.5', description: 'A mix of reliability and creativity' },
          { value: 0.7, label: '0.7', description: 'More expressive and varied responses' },
          { value: 1.0, label: '1.0', description: 'Highly creative and open-ended' },
        ]"
      /> -->
      <FormInput
        class="my-3"
        title="Response Directness"
        subtitle="Adjusts how creative or serious thechatbot replies are."
        type="dropdown"
        v-model="form.personaTemperature"
        placeholder="Select your response directness"
        :options="[
          { value: '0.2', label: 'Very direct and serious replies' },
          { value: '0.5', label: 'Balanced and natural replies' },
          { value: '0.7', label: 'Slightly creative and friendly' },
          { value: '1.0', label: 'Very creative and casual replies' },
        ]"
        required
      />
      <FormInput
        class="my-3"
        title="Allow AI to Query Room Rate?"
        subtitle="Allow AI to query and send room rate to customer"
        type="checkbox"
        v-model="form.queryRoomRate"
      />
    </form>
  </div>
</template>
