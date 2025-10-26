<script lang="ts" setup>
import FilterButtonIcon from '@/components/Icons/FilterButtonIcon.vue'
import type { LabelValueOption } from '@/interfaces/general_interface'
import { ref, onMounted, onBeforeUnmount, defineProps, defineEmits, watch } from 'vue'

const props = defineProps<{
  options: LabelValueOption[]
  selected: Record<string, boolean>
}>()

const emit = defineEmits<{
  (e: 'update:selected', value: Record<string, boolean>): void
}>()

const isOpen = ref(false)
const localSelected = ref({ ...props.selected })

watch(
  () => props.selected,
  (newVal) => {
    localSelected.value = { ...newVal }
  },
  { deep: true },
)

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function handleClickOutside(event: MouseEvent) {
  const dropdown = document.querySelector('.d-inline-block')
  if (dropdown && !dropdown.contains(event.target as Node)) {
    isOpen.value = false
  }
}

function updateSelection() {
  emit('update:selected', { ...localSelected.value })
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="position-relative d-inline-block">
    <FilterButtonIcon @click.stop="toggleDropdown" />

    <div
      v-if="isOpen"
      class="position-absolute end-0 mt-2 bg-white border rounded shadow p-3 z-50"
      style="width: 250px"
    >
      <h6 class="text-muted mb-1">Booking Status</h6>

      <div v-for="option in props.options" :key="option.value" class="form-check mt-2">
        <input
          type="checkbox"
          class="form-check-input"
          :id="`check-${option.value}`"
          v-model="localSelected[option.value]"
          @change="updateSelection"
        />
        <label class="form-check-label" :for="`check-${option.value}`">
          {{ option.label }}
        </label>
      </div>
    </div>
  </div>
</template>
