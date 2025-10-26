<script setup lang="ts">
defineProps({
  to: {
    type: String,
    required: true,
  },
  navText: {
    type: String,
    required: true,
  },
  backgroundColor: {
    type: String,
    required: true,
  },
  isBordered: {
    type: Boolean,
    required: true,
  },
})
</script>

<template>
  <router-link :to="to" class="nav-link">
    <div
      class="nav-item-container d-flex flex-row justify-content-start"
      :class="isBordered ? 'bordered' : ''"
      :style="{ backgroundColor: backgroundColor }"
    >
      <div
        class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center"
      >
        <slot name="icon"></slot>
      </div>
      <span class="nav-link-text ms-2 medium-text">{{ navText }}</span>
    </div>
  </router-link>
</template>

<style>
.nav-item-container {
  margin-right: 1rem;
  margin-left: 1rem;
  padding: 1rem 1.5rem 1rem 1.5rem;
  border-radius: 1rem;
}

.nav-item-container:hover {
  background-color: #f6f6f6 !important;
}

.nav-link-text {
  color: #273c8c;
}

.bordered {
  border: 1px solid #d9d9d9;
}
</style>
