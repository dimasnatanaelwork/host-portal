<script lang="ts" setup>
import SearchIcon from '@/components/Icons/SearchIcon.vue'
import { ref, watch } from 'vue'

defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const inputText = ref('')

let debounceTimer: ReturnType<typeof setTimeout>

watch(inputText, (newVal) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('update:modelValue', newVal)
  }, 2000)
})
</script>

<template>
  <div class="search-input-wrapper">
    <SearchIcon class="search-icon" />
    <input
      type="text"
      class="form-control search-input"
      placeholder="Search booking here"
      v-model="inputText"
    />
  </div>
</template>

<style scoped>
.search-input-wrapper {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  pointer-events: none;
}

.search-input {
  padding-left: 3rem;
}
</style>
