<script lang="ts" setup>
import { capitalizeFirstLetter, toTitleCaseFromSnakeOrKebab } from '@/utils/utils'
import { computed } from 'vue'

interface Props {
  text: string
  statusType?: 'paid' | 'unpaid' | 'pending' | 'pending_payment' | 'failed' | 'checkin' | 'checkout'
  icon?: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="d-flex flex-row gap-3">
    <div :class="['status-label', statusType]">
      <span class="status-icon" v-if="$slots.icon">
        <slot name="icon" />
      </span>
      <span class="status-text fw-bold small-text">{{ toTitleCaseFromSnakeOrKebab(text) }}</span>
    </div>
    <slot name="secondary_status" />
  </div>
</template>

<style scoped>
.status-label {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.15rem 0.25rem;
  border-radius: 18px;
  font-size: 1rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1.5px solid transparent;
  user-select: none;
  margin: 4px 0;
}

.status-label .status-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* status styles */
.status-label.paid {
  background: #ebfcf2;
  color: #1d9436;
}
.status-label.unpaid {
  background: #ffeceb;
  color: #da1e1c;
}
.status-label.pending {
  background: #fcf4e2;
  color: #ffac00;
}
.status-label.pending_payment {
  background: #fcf4e2;
  color: #ffac00;
}
.status-label.failed {
  background: #efefef;
  color: #5c5e64;
}
.status-label.checkout {
  background: #ebfcf2;
  color: #1d9436;
}

.status-text {
  line-height: 1.3;
  white-space: nowrap;
}
</style>
