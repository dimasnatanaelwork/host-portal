<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue'

const props = defineProps<{
  btn_text: string
  btn_func: Function
  btn_type?: ButtonHTMLAttributes['type']
  isLoading?: boolean
}>()
</script>

<template>
  <button
    :type="btn_type"
    class="btn w-100"
    style="background-color: #202224; color: white"
    :onclick="btn_func"
    :disabled="isLoading"
  >
    <div v-if="isLoading" class="spinner-border text-light" role="status" />
    <div v-else>
      <span class="text-nowrap">
        {{ btn_text }}
      </span>
    </div>
  </button>
</template>
