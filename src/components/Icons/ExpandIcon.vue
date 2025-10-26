<script setup lang="ts">
import { computed } from 'vue'

// Props: isExpanded is passed from parent
const props = defineProps<{
  isExpanded: boolean
}>()

// Emit event to notify parent of toggle
const emit = defineEmits<{
  (e: 'update:isExpanded', value: boolean): void
}>()

function toggle() {
  emit('update:isExpanded', !props.isExpanded)
}

const svgStyle = computed(() => ({
  transition: 'transform 0.3s cubic-bezier(.4,2,.6,1)',
  transform: props.isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
}))
</script>

<template>
  <!-- <button @click="toggle" class="svg-btn" aria-label="Expand/Collapse"> -->
  <div class="svg-btn" aria-label="Expand/Collapse">
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      :style="svgStyle"
    >
      <rect width="40" height="40" rx="20" transform="matrix(1 0 0 -1 0 40)" fill="#F1F1F1" />
      <path
        d="M24.7072 19.0407L21.6498 22.0973C21.2054 22.5219 20.6144 22.7588 19.9998 22.7588C19.3852 22.7588 18.7943 22.5219 18.3498 22.0973L15.2925 19.0407C15.1049 18.8531 14.9995 18.5986 14.9995 18.3333C14.9995 18.068 15.1049 17.8136 15.2925 17.626C15.4801 17.4384 15.7345 17.333 15.9998 17.333C16.2651 17.333 16.5196 17.4384 16.7072 17.626L19.7645 20.6833C19.827 20.7458 19.9118 20.7809 20.0002 20.7809C20.0886 20.7809 20.1733 20.7458 20.2358 20.6833L23.2925 17.626C23.4801 17.4384 23.7345 17.333 23.9998 17.333C24.2651 17.333 24.5196 17.4384 24.7072 17.626C24.8948 17.8136 25.0002 18.068 25.0002 18.3333C25.0002 18.5986 24.8948 18.8531 24.7072 19.0407Z"
        fill="#202224"
      />
    </svg>
  </div>
  <!-- </button> -->
</template>

<style scoped>
.svg-btn {
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  outline: none;
  pointer-events: none;
}
</style>
