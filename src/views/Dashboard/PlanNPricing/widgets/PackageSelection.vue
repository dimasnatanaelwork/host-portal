<script lang="ts" setup>
import FormInput from '@/components/Form/FormInput.vue'
import SingleGridContainer from '@/components/SectionPanel/SingleGridContainer.vue'
import type { HotelSummary } from '@/interfaces/aichatbot'
import type { GridOption } from '@/interfaces/subscription'
import type { LabelValueOption } from '@/interfaces/general_interface'
import PropertyTable from '@/widgets/PropertyTable.vue'
import { ref, watch } from 'vue'

const props = defineProps<{
  chatbotNameValue: string
  selectedPackageValue: number
  chatbotNames: LabelValueOption[]
  currentActivePackage: number
  hasActivePackage: boolean
  gridOptions: GridOption[]
  properties: HotelSummary[]
  // mode: 'subscribe' | 'renew'
}>()

const emit = defineEmits(['update:chatbotNameValue', 'update:selectedPackageValue'])

const chatbotName = ref(props.chatbotNameValue)
const selectedPackage = ref(props.selectedPackageValue)

watch(
  () => props.chatbotNameValue,
  (newVal) => {
    chatbotName.value = newVal
  },
)

watch(
  () => props.selectedPackageValue,
  (newVal) => {
    selectedPackage.value = newVal
  },
)

watch(chatbotName, (val) => {
  if (val !== props.chatbotNameValue) {
    emit('update:chatbotNameValue', val)
  }
})

watch(selectedPackage, (val) => {
  if (val !== props.selectedPackageValue) {
    emit('update:selectedPackageValue', val)
  }
})

const packageSummaryRows = [
  { label: 'Base Chatbot Subscription Fee', value: props.gridOptions[0].price },
  { label: 'Additional Unit Charges', value: `RM0` },
]
</script>

<template>
  <div class="card p-3">
    <!-- :disabled="mode === 'renew'" -->
    <FormInput
      class="my-3"
      title="ChatBot Name"
      placeholder="Select your chatbot name"
      type="dropdown"
      v-model="chatbotName"
      :options="chatbotNames"
      :labelTop="true"
      required
    />
    <SingleGridContainer
      :hasActivePlan="hasActivePackage"
      :price="gridOptions[0].price"
      :note="gridOptions[0].note"
      :description="gridOptions[0].description"
      :hasBody="true"
    >
      <template #bodyContent>
        <div class="card rounded-3 border-0">
          <div class="card-body header-bg rounded-top border-bottom">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-0 fw-semibold">Total Units Populated</h6>
                <small class="text-muted smaller-text"
                  >Base subscription includes first 20 units</small
                >
              </div>
              <span class="fw-semibold small-text">
                {{ properties.reduce((sum, item) => sum + item.total_units, 0) }}
              </span>
            </div>
          </div>
          <table class="table mb-0 custom-table rounded-3 overflow-hidden small-text">
            <tbody>
              <tr v-for="(row, index) in gridOptions[0].billingItems" :key="index">
                <td class="fw-semibold bg-transparent">{{ row.desc }}</td>
                <td class="text-end fw-semibold bg-transparent">{{ row.total_price }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </SingleGridContainer>
    <template v-if="chatbotName !== ''">
      <div class="d-flex flex-row align-items-center gap-3 my-3">
        <h4>Property Listing</h4>
        <!-- <TagComponent>
          <template #tagContent>
            <span class="small-text fw-600">
              Total Unit: {{ properties.reduce((sum, item) => sum + item.total_units, 0) }}
            </span>
          </template>
        </TagComponent> -->
      </div>
      <PropertyTable :properties="properties" :hasEdit="false" />
    </template>
  </div>
</template>

<style scoped>
.custom-table tr:nth-child(odd) {
  background-color: #fcfbfb !important;
}
.custom-table tr:nth-child(even) {
  background-color: #f6f6f6 !important;
}
.custom-table td {
  border: none !important;
}
.header-bg {
  background-color: #f6f6f6 !important;
}
</style>
