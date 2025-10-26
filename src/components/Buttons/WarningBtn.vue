<script lang="ts" setup>
defineProps<{
  btnText: string
}>()
</script>

<template>
  <button class="h-100 warning-btn px-3 py-2 text-nowrap">{{ btnText }}</button>
</template>

<style scoped>
.warning-btn {
  background-color: red;
  color: #ffffff;
  border-radius: 0.5rem;
  border: none;
}

.primary-btn:hover {
  background-color: pink;
}
</style>
