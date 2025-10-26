<script setup lang="ts">
import { ref } from 'vue'
import SidenavExpandIcon from '../Icons/sidenav/SidenavExpandIcon.vue'

defineProps({
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

const isExpanded = ref(false)

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div
    class="nav-item-container"
    :style="[{ backgroundColor: backgroundColor }]"
    @click="toggleExpand"
  >
    <header class="header">
      <div
        class="d-flex flex-row justify-content-between align-items-center"
        :class="isBordered ? 'bordered' : ''"
      >
        <div class="d-flex flex-row">
          <div
            class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center"
          >
            <slot name="icon"></slot>
          </div>
          <span class="nav-link-text ms-2 medium-text">{{ navText }}</span>
        </div>

        <SidenavExpandIcon v-model:isExpanded="isExpanded" />
      </div>
    </header>
  </div>
  <transition name="expand">
    <section v-show="isExpanded" class="content">
      <slot name="bodyContent"></slot>
    </section>
  </transition>
</template>

<style scoped>
.nav-item-container {
  margin: 0.5rem 1rem;
  padding: 1rem 1.5rem 1rem 1.5rem;
  border-radius: 1rem;
  position: relative;
  cursor: pointer;
}

.header {
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  position: relative;
}

.content {
  margin-top: 0.5rem;
  padding-left: 3rem;
  background-color: white;
  overflow: hidden;
  border-bottom-right-radius: 1rem;
  border-bottom-left-radius: 1rem;
}

.nav-link-text {
  color: #273c8c;
}

.bordered {
  border: 1px solid #d9d9d9;
}
</style>
