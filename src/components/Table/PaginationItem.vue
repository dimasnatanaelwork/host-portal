<script lang="ts" setup>
defineProps<{
  pageNumber: number
  isActive: boolean
}>()
</script>

<template>
  <div class="page-container" :class="{ 'is-active': isActive }">
    <span class="small-text">
      {{ pageNumber }}
    </span>
  </div>
</template>

<style scoped>
.is-active {
  color: #ffffff;
  background-color: #273c8c;
}

.page-container {
  /* border: 1px solid grey; */
  border-radius: 0.5rem;
  padding: 0.5rem 1rem 0.5rem 1rem;
  cursor: pointer;
}

.page-container:hover {
  background-color: #273c8c;
  color: #ffffff;
}
</style>
