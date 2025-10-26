<script lang="ts" setup>
import { ref, watch } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { startOfMonth, endOfMonth, subDays, subMonths } from 'date-fns'
// import DateRangeIcon from '@/components/Icons/DateRangeIcon.vue'

const isMenuOpen = ref(false)
const dpRef = ref()

const props = defineProps<{
  modelValue: [Date, Date] | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: [Date, Date] | null): void
}>()

const internalRange = ref<[Date, Date] | null>(props.modelValue)

watch(internalRange, (val) => {
  emit('update:modelValue', val)
})

const presetDates = [
  { label: 'Today', value: [new Date(), new Date()] },
  { label: 'Yesterday', value: [subDays(new Date(), 1), subDays(new Date(), 1)] },
  { label: 'This week', value: [subDays(new Date(), new Date().getDay()), new Date()] },
  { label: 'This month', value: [startOfMonth(new Date()), new Date()] },
  {
    label: 'Last month',
    value: [startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1))],
  },
  // 👇 Add dummy value to satisfy type
  // { label: 'Custom range', value: [new Date(), new Date()], slot: 'custom' },
]
</script>

<template>
  <VueDatePicker
    ref="dpRef"
    v-model="internalRange"
    range
    :preset-dates="presetDates"
    :locale="'ms-MY'"
    :format="'dd/MM/yyyy'"
    @closed="isMenuOpen = false"
  >
  </VueDatePicker>
</template>
