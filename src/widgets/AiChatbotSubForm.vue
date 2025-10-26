<script lang="ts" setup>
import FormInput from '@/components/Form/FormInput.vue'
import Popup from '@/components/Popup/Popup.vue'
import { useSubscription } from '@/composables/useSubscription'
import type { RequireField } from '@/interfaces/subscription'
import { useLoadingStore } from '@/stores/loadingStore'
import { computed, onMounted, reactive, watch } from 'vue'
import { ref, type Ref } from 'vue'

defineProps<{
  chatbotPopupVisible: boolean
}>()

const { loading, error, platformTypes, loadPlatformTypes, submitChatbot } = useSubscription()
const loadingStore = useLoadingStore()
watch(loading, (newLoadingStatus) => {
  loadingStore.setLoading(newLoadingStatus)
})

type FormType = {
  chatbotName: string
  channelManager: string
  // pmsName?: string
}

const form: Ref<FormType> = ref({
  chatbotName: '',
  channelManager: '',
  // pmsName: '',
})

onMounted(async () => {
  await loadPlatformTypes()
  form.value = {
    chatbotName: '',
    channelManager: '',
    // pmsName: '',
  }
})

const dynamicFields = reactive<Record<string, string | number>>({})

watch(
  () => form.value.channelManager,
  (newVal) => {
    const platform = platformTypes.value?.platform_types.find((p) => p.value === newVal)
    if (platform) {
      Object.keys(dynamicFields).forEach((key) => delete dynamicFields[key]) // Clear existing dynamic fields

      platform.require_fields.forEach((field) => {
        dynamicFields[field.key] = ''
      }) // Initialize dynamic fields with empty values
    } else {
      Object.keys(dynamicFields).forEach((key) => delete dynamicFields[key]) // Clear if no platform
    }
  },
)

const emits = defineEmits<{
  (e: 'close'): void
  (
    e: 'confirm',
    isSuccess: boolean,
    hasSelectedPMS: boolean,
    newPropertyId: number | null,
    newChatbotId: number | null,
    errorMsg: string,
  ): void
}>()

const onClose = () => {
  emits('close')
}

// only to trigger close popup
const onConfirm = (
  isSuccess: boolean,
  errorMsg: string,
  newPropertyId: number | null,
  newChatbotId: number | null,
) => {
  let hasCompletePMSData = true
  for (const key in dynamicFields) {
    if (Object.prototype.hasOwnProperty.call(dynamicFields, key)) {
      const value = dynamicFields[key]

      if (value === '' || value === null || typeof value === 'undefined') {
        console.log(
          'the value for ' +
            key +
            ' is ' +
            value +
            '. There is an incomplete data, therefore integration not complete',
        )
        hasCompletePMSData = false // Found an empty value
        break
      }
    }
  }

  console.log(
    'The chosen PMS is ' +
      form.value.channelManager +
      ' and the completion status of the required data is ' +
      hasCompletePMSData,
  )

  if (
    !hasCompletePMSData ||
    form.value.channelManager === null ||
    form.value.channelManager === ''
  ) {
    emits('confirm', isSuccess, false, newPropertyId, newChatbotId, errorMsg)
  } else {
    emits('confirm', isSuccess, true, newPropertyId, newChatbotId, errorMsg)
  }
}

const onSubmitChatbot = async () => {
  try {
    const res = await submitChatbot(
      form.value.channelManager,
      form.value.chatbotName,
      dynamicFields,
    )

    if (res.status !== 'success') {
      onConfirm(false, error.value!, res.data.hotel.id, res.data.ai_chatbot.id)
    } else {
      onConfirm(true, '', res.data.hotel.id, res.data.ai_chatbot.id)
    }
  } catch (err) {
    onConfirm(false, `Error submitting: ${err}`, null, null)
  }
}
</script>

<template>
  <Popup
    title="Almost There! Let’s Get Your Chatbot Started"
    closeBtnText="Cancel"
    confirmBtnText="Confirm"
    v-if="chatbotPopupVisible"
    @close="onClose"
    @confirm="onSubmitChatbot"
  >
    <template #descriptions>
      <p class="small-text">Complete the setup below and activate your chatbot instantly.</p>
    </template>
    <template #bodyContent>
      <form class="w-100">
        <h6>Chatbot Information</h6>
        <FormInput
          class="my-3"
          title="ChatBot Name"
          placeholder="Enter your Chatbot name"
          type="text"
          v-model="form.chatbotName"
          :labelTop="true"
          required
        />

        <h6>Integration Info</h6>

        <div :class="{ 'w-50 pe-2': form.channelManager !== 'other' }">
          <FormInput
            class="my-3"
            title="PMS / Channel Manager"
            type="dropdown"
            v-model="form.channelManager"
            placeholder="Select your PMS name"
            :options="platformTypes?.platform_types"
            :labelTop="true"
            :hasSubInput="form.channelManager == 'other'"
          >
            <template #subinput>
              <FormInput
                placeholder="Enter your PMS name"
                type="text"
                v-model="
                  dynamicFields[
                    platformTypes?.platform_types.find((p) => p.value === 'other')
                      ?.require_fields[0].key!
                  ]
                "
                :labelTop="true"
              />
            </template>
          </FormInput>
        </div>

        <div
          class="row"
          v-if="platformTypes?.platform_types.length! > 0 && form.channelManager !== 'other'"
        >
          <div
            class="col-6"
            v-for="field in platformTypes?.platform_types.find(
              (p) => p.value === form.channelManager,
            )?.require_fields || []"
            :key="field.key"
          >
            <FormInput
              class="my-1"
              :title="field.label"
              :placeholder="'Enter ' + field.label"
              type="text"
              v-model="dynamicFields[field.key]"
              :labelTop="true"
            />
          </div>
        </div>
      </form>
    </template>
  </Popup>
</template>
