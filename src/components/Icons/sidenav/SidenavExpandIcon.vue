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
  <div class="svg-btn" aria-label="Expand/Collapse">
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      :style="svgStyle"
    >
      <g transform="translate(8 8) rotate(180) translate(-8 -8)">
        <path
          d="M11.5284 10.4708C11.7888 10.7311 12.2109 10.7311 12.4712 10.4708C12.7316 10.2104 12.7316 9.78829 12.4712 9.52794L8.47124 5.52794C8.21089 5.2676 7.78878 5.2676 7.52843 5.52794L3.52843 9.52794C3.26808 9.78829 3.26808 10.2104 3.52843 10.4708C3.78878 10.7311 4.21089 10.7311 4.47124 10.4708L7.99984 6.94216L11.5284 10.4708Z"
          fill="#273C8C"
        />
      </g>
    </svg>
  </div>
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
