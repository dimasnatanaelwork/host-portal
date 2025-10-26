<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="fixed-panel">
    <header class="header" style="border-bottom: 1px solid #ddd">
      <div class="d-flex flex-row position-relative">
        <div class="d-flex flex-column">
          <span class="title medium-text">{{ title }}</span>
        </div>
      </div>
    </header>

    <transition name="expand">
      <section class="content">
        <slot name="bodyContent"></slot>
      </section>
    </transition>
  </div>
</template>

<style scoped>
.fixed-panel {
  border: 1px solid #ccc;
  border-radius: 1rem;
  width: 100%;
  font-family: Arial, sans-serif;
  position: relative;
}

.header {
  display: flex;
  flex-direction: column;
  padding: 10px 15px;
  cursor: pointer;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  position: relative;
}

@media (min-width: 1024px) {
  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.title {
  font-weight: 600;
}

.content {
  padding: 15px;
  background-color: white;
  overflow: hidden;
  border-bottom-right-radius: 1rem;
  border-bottom-left-radius: 1rem;
}
</style>
