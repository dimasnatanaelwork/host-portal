<script lang="ts" setup>
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
})
</script>

<template>
  <router-link :to="to" class="no-underline-link">
    <div class="subitem-container pb-1">
      <div class="menu-container" :style="{ backgroundColor: backgroundColor }">
        <span class="nav-link-text ms-2 small-text">{{ navText }}</span>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.subitem-container {
  border-left: 2px solid #d9d9d9;
}

.menu-container {
  border-radius: 0.75rem;
  margin-left: 1rem;
  margin-right: 1rem;
  padding: 8px 12px;
  cursor: pointer;
  padding-bottom: 0.5rem;
}

.menu-container:hover {
  background-color: #f6f6f6 !important;
}

.nav-link-text {
  color: #273c8c;
}

.no-underline-link {
  text-decoration: none;
}
</style>
