<script lang="ts" setup>
const props = defineProps<{ btnText: string; iconStrokeColor?: string }>()
</script>

<template>
  <button
    class="btn border border-dark rounded icon-btn px-3 py-2"
    :style="{
      '--icon-stroke-color': props.iconStrokeColor || '#202224',
    }"
  >
    <div class="d-flex flex-row align-items-center gap-2 flex-nowrap text-nowrap overflow-auto">
      <slot name="btnIcon"></slot>
      <span class="small-text fw-600 text-nowrap">{{ btnText }}</span>
    </div>
  </button>
</template>

<style scoped>
.icon-btn {
  border-color: #f1f1f1 !important;
  --icon-stroke-color: #202224;
  --icon-fill-color: #202224;
}
.icon-btn:hover {
  border-color: #273c8c !important;
  background-color: #273c8c;
  color: white;
  --icon-stroke-color: white !important;
  --icon-fill-color: white;
}
.icon-btn:disabled {
  pointer-events: auto !important; /* Force events even when disabled */
}
</style>
