<script lang="ts" setup>
defineProps<{
  btnText: string
}>()
</script>

<template>
  <button class="create-btn btn fw-bold text-nowrap">{{ btnText }}</button>
</template>

<style scoped>
.create-btn {
  border: solid 1px #d5d7da;
  border-radius: 0.5rem;
}

.create-btn:hover {
  border: solid 1px black;
}
</style>
