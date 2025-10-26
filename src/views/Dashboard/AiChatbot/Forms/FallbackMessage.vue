<script lang="ts" setup>
import { useRouter } from 'vue-router'
import FormInput, { type ValidationRule } from '@/components/Form/FormInput.vue'
import FormHeader from '@/components/Form/FormHeader.vue'
import { onMounted, ref, watch, computed } from 'vue'
import type { Ref } from 'vue'
import { useAiChatbot } from '@/composables/useAiChatbot'
import { useLoadingStore } from '@/stores/loadingStore'
import { useFormSubmitMsgStore } from '@/stores/formSubmitMsg'

const formSubmitMsgStore = useFormSubmitMsgStore()
const router = useRouter()

const { loading, forwardRuleDetail, loadForwardRule, createForwardRule, updateForwardRule } =
  useAiChatbot()

const loadingStore = useLoadingStore()
watch(loading, (newLoadingStatus) => {
  loadingStore.setLoading(newLoadingStatus)
})

const props = defineProps<{
  id: number
  mode: 'edit' | 'add'
  chatbotId: number
  chatbotName: string
}>()

type FormType = {
  title: string
  forwardMessageTo: string
  essentialConditions: string
  fallbackMessage: string
}

const form: Ref<FormType> = ref({
  title: '',
  forwardMessageTo: '',
  essentialConditions: '',
  fallbackMessage: '',
})

const formRef = ref<HTMLFormElement | null>(null)

const forwardMessageToRules: ValidationRule[] = [
  {
    type: 'custom',
    validator: (value: string): boolean => {
      if (!value) return true
      return !/\s/.test(value)
    },
    message: 'Spaces are not allowed in phone numbers',
  },
  {
    type: 'custom',
    validator: (value: string): boolean => {
      if (!value) return true

      // split by comma, trim each number
      const numbers = value
        .split(',')
        .map((num) => num.trim())
        .filter((num) => num.length > 0)

      // check if all numbers are valid
      const phoneRegex = /^(\+?\d{1,4}?[-.\s]?)?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/
      const allNumbersValid = numbers.every((num) => phoneRegex.test(num))

      return allNumbersValid
    },
    message: 'Please enter valid phone numbers separated by commas',
  },
  {
    type: 'custom',
    validator: (value: string): boolean => {
      if (!value) return true

      // check for proper comma separation (no trailing commas, no consecutive commas)
      const commaRegex = /^[^,]+(,[^,]+)*$/
      return commaRegex.test(value.trim())
    },
    message: 'Please separate numbers with commas properly (no trailing or consecutive commas)',
  },
  // {
  //   type: 'custom',
  //   validator: (value: string): boolean => {
  //     if (!value) return true

  //     // remove all whitespace and check length
  //     const cleanValue = value.replace(/\s/g, '')
  //     return cleanValue.length <= 500
  //   },
  //   message: 'Total length of all numbers cannot exceed 500 characters',
  // },
]

const forwardMessageToValid = ref(true)

// Event handler for validation changes
function onForwardMessageToValidation(isValid: boolean, errors: string[] = []) {
  forwardMessageToValid.value = isValid
}

const isFormValid = computed(() => {
  return forwardMessageToValid.value
})

onMounted(async () => {
  if (props.mode === 'edit') {
    const res = await loadForwardRule(props.chatbotId, props.id)

    if (res.status === 'success') {
      form.value.title = forwardRuleDetail.value?.title!
      form.value.forwardMessageTo = forwardRuleDetail.value?.forward_message_to!
      form.value.essentialConditions = forwardRuleDetail.value?.function_instruction!
      form.value.fallbackMessage = forwardRuleDetail.value?.forward_message_response!
    }
  }
})

const onSubmitForm = async () => {
  if (!isFormValid.value) {
    return
  }

  if (formRef.value && !formRef.value.reportValidity()) {
    return
  }

  if (props.mode === 'add') {
    const res = await createForwardRule(
      props.chatbotId,
      form.value.title,
      form.value.forwardMessageTo,
      form.value.essentialConditions,
      form.value.fallbackMessage,
      1,
    )
    if (res.status_code != 422) {
      formSubmitMsgStore.setMessageStatus('addFallbackMsgSuccess')
      router.back()
    } else {
      alert(res.msg)
    }
  } else {
    const res = await updateForwardRule(
      props.chatbotId,
      props.id,
      form.value.title,
      form.value.forwardMessageTo,
      form.value.essentialConditions,
      form.value.fallbackMessage,
      1,
    )
    if (res.status_code != 422) {
      formSubmitMsgStore.setMessageStatus('editFallbackMsgSuccess')
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
      :formTypeTitle="(mode === 'edit' ? 'Edit' : 'Add New') + ' Fallback Message'"
      @submit="onSubmitForm"
    />
    <form ref="formRef" @submit.prevent="onSubmitForm">
      <FormInput
        class="my-3"
        title="Message Title"
        subtitle="Set title for your fallback message"
        type="text"
        v-model="form.title"
        required
      />
      <FormInput
        class="my-3"
        title="Forward message to"
        subtitle="Contact number for support when chatbot cannot assist"
        type="text"
        v-model="form.forwardMessageTo"
        hint="If you want to send to multiple numbers, separate them with a comma (,) like this: 6016XXXXXXX,6017XXXXXXX,6018XXXXXXX"
        :validation-rules="forwardMessageToRules"
        :validateOnInput="true"
        @validation-change="onForwardMessageToValidation"
      />
      <FormInput
        class="my-3"
        title="Essential Conditions"
        subtitle="Explain when the question should be passed to an admin"
        type="textarea"
        v-model="form.essentialConditions"
        :textAreaLimit="500"
      />
      <FormInput
        class="my-3"
        title="Fallback Message"
        subtitle="Chatbot will say this when it cannot respond to a message"
        type="textarea"
        v-model="form.fallbackMessage"
        :textAreaLimit="150"
      />
    </form>
  </div>
</template>
