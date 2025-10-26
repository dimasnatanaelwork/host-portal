<script lang="ts" setup>
defineProps<{
  btnText?: string
}>()
</script>

<template>
  <button class="h-100 secondary-btn px-3 py-2 text-nowrap">{{ btnText ?? 'Cancel' }}</button>
</template>

<style scoped>
.secondary-btn {
  background-color: transparent;
  border: 1px solid #d5d7da;
  border-radius: 0.5rem;
}

.secondary-btn:hover {
  color: #ffffff;
  background-color: lightgrey;
  border: none;
}
</style>
