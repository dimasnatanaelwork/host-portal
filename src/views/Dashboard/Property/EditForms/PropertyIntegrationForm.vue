<script lang="ts" setup>
import FormHeader from '@/components/Form/FormHeader.vue'
import FormInput from '@/components/Form/FormInput.vue'
import { useProperty } from '@/composables/useProperty'
import { useSubscription } from '@/composables/useSubscription'
import type { Hotel } from '@/interfaces/property'
import { useFormSubmitMsgStore } from '@/stores/formSubmitMsg'
import { useLoadingStore } from '@/stores/loadingStore'
import { computed, onMounted, reactive, ref, watch, type Ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const formSubmitMsgStore = useFormSubmitMsgStore()
const { platformTypes, loadPlatformTypes, submitPmsInfo } = useSubscription()
const { loading, propertyDetail, loadPropertyDetail } = useProperty()
const loadingStore = useLoadingStore()
watch(loading, (newLoadingStatus) => {
  loadingStore.setLoading(newLoadingStatus)
})

const props = defineProps<{
  id: number
}>()

type FormType = {
  // chatbotName: string
  channelManager: string
  // pmsName?: string
}

const form: Ref<FormType> = ref({
  // chatbotName: '',
  channelManager: '',
  // pmsName: '',
})

const dynamicFields = reactive<Record<string, string | number>>({})

onMounted(async () => {
  await loadPropertyDetail(props.id)
  const res = await loadPlatformTypes()

  form.value = {
    // chatbotName: '',
    channelManager: propertyDetail.value?.hotel.system_platform ?? '',
    // pmsName: '',
  }
})

watch(
  () => form.value.channelManager,
  (newVal) => {
    // if selected value is the same as the one already stored in backend, repopulate the already added values
    if (newVal == propertyDetail.value?.hotel.system_platform) {
      const platform = platformTypes.value?.platform_types.find(
        (p) => p.value === propertyDetail.value?.hotel.system_platform,
      )
      if (platform) {
        Object.keys(dynamicFields).forEach((key) => delete dynamicFields[key]) // Clear existing dynamic fields

        platform.require_fields.forEach((field) => {
          const key = field.key as keyof Hotel
          dynamicFields[field.key] = propertyDetail.value?.hotel[key]!
        })
      } else {
        Object.keys(dynamicFields).forEach((key) => delete dynamicFields[key]) // Clear if no platform
      }
    } else {
      const platform = platformTypes.value?.platform_types.find((p) => p.value === newVal)
      if (platform) {
        Object.keys(dynamicFields).forEach((key) => delete dynamicFields[key]) // Clear existing dynamic fields

        platform.require_fields.forEach((field) => {
          dynamicFields[field.key] = ''
        }) // Initialize dynamic fields with empty values
      } else {
        Object.keys(dynamicFields).forEach((key) => delete dynamicFields[key]) // Clear if no platform
      }
    }
  },
)

const otherPlatformFieldValue = computed(() => {
  if (form.value.channelManager !== 'other') return ''

  const otherPlatform = platformTypes.value?.platform_types.find((p) => p.value === 'other')
  const firstFieldKey = otherPlatform?.require_fields[0]?.key

  if (!firstFieldKey) return ''

  return dynamicFields[firstFieldKey]?.toString() || ''
})

const onSubmitForm = async () => {
  const res = await submitPmsInfo(form.value.channelManager, props.id, dynamicFields)
  if (res.status_code != 422) {
    formSubmitMsgStore.setMessageStatus('editPropertyIntegrationInfoSuccess')
    router.back()
  } else {
    alert(res.msg)
  }
}
</script>

<template>
  <div class="container">
    <FormHeader
      :formTitle="`Edit ${propertyDetail?.hotel.hotel_name}`"
      formTypeTitle="Edit Info"
      @submit="onSubmitForm"
      saveBtnText="Submit"
    />
    <form ref="formRef" @submit.prevent="onSubmitForm">
      <FormInput
        class="my-3"
        title="PMS / Channel Manager"
        subtitle="Select PMS/Channel Manager for synchronization and connection.”"
        type="dropdown"
        v-model="form.channelManager"
        placeholder="Select your PMS name"
        :options="platformTypes?.platform_types"
        :hasSubInput="form.channelManager == 'other'"
      >
        <template #subinput>
          <FormInput
            placeholder="Submit your connecting PMS/Channel Manager for integration."
            type="text"
            v-model="
              dynamicFields[
                platformTypes?.platform_types.find((p) => p.value === 'other')?.require_fields[0]
                  .key!
              ]
            "
            :labelTop="true"
          />
        </template>
      </FormInput>
      <template v-if="form.channelManager == 'other' && otherPlatformFieldValue.length <= 0">
        <div class="card border-0 rounded-3 text-center py-3 note-container">
          <span class="small-text fw-600">
            Please submit the connecting PMS / Channel Manager. Our sales team will contact you
            afterward to complete the integration.
          </span>
        </div>
      </template>
      <template v-if="!form.channelManager">
        <div class="card border-0 rounded-3 text-center py-3 note-container">
          <span class="small-text fw-600">
            To configure units and rooms, select a PMS / Channel Manager. If not listed, select
            ‘Other’ and submit — our sales team will contact you shortly.
          </span>
        </div>
      </template>
      <template v-if="platformTypes?.platform_types.length! > 0 && form.channelManager !== 'other'">
        <FormInput
          v-for="field in platformTypes?.platform_types.find((p) => p.value === form.channelManager)
            ?.require_fields || []"
          :key="field.key"
          class="my-3"
          :title="field.label"
          :subtitle="field.sub_label"
          :placeholder="'Enter ' + field.label"
          type="text"
          v-model="dynamicFields[field.key]"
        />
      </template>
    </form>
  </div>
</template>

<style scoped>
.note-container {
  background-color: #f1f1f1;
}
</style>
