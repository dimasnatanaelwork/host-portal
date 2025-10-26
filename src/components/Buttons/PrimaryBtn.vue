<script lang="ts" setup>
defineProps<{
  btnText: string
}>()
</script>

<template>
  <button class="h-100 primary-btn px-3 py-2 text-nowrap">{{ btnText }}</button>
</template>

<style scoped>
.primary-btn {
  background-color: #273c8c;
  color: #ffffff;
  border-radius: 0.5rem;
  border: none;
}

.primary-btn:hover {
  background-color: #0056b3;
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
