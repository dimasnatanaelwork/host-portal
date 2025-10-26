<script lang="ts" setup>
import { capitalizeFirstLetter, toTitleCaseFromSnakeOrKebab } from '@/utils/utils'
import { computed } from 'vue'

interface Props {
  text: string
  statusType?:
    | 'in-review'
    | 'rejected'
    | 'approved'
    | 'active-pending'
    | 'active-high'
    | 'active-medium'
    | 'active-low'
    | 'paused'
    | 'disabled'
    | 'appeal'
    | 'draft'
    | 'active'
    | 'inactive'
    | 'pending_activation'
    | 'pending_payment'
    | 'trial_period'
    | 'chatbot_paused'
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
.status-label.in-review {
  background: #f3f4f6;
  color: #475569;
}
.status-label.rejected {
  background: #ffeceb;
  color: #da1e1c;
}
.status-label.approved {
  background: #e8f6ef;
  color: #2e7d32;
}
.status-label.active {
  background: #e8f6ef;
  color: #2e7d32;
}
.status-label.inactive {
  background: #ffeceb;
  color: #da1e1c;
}
.status-label.active-pending {
  background: #ebfcf2;
  color: #1d9436;
}
.status-label.active-high {
  background: #ebfcf2;
  color: #1d9436;
}
.status-label.active-medium {
  background: #ebfcf2;
  color: #1d9436;
}
.status-label.active-low {
  background: #ebfcf2;
  color: #1d9436;
}
.status-label.paused {
  background: #fcf4e2;
  color: #ffac00;
}
.status-label.disabled {
  background: #ffeceb;
  color: #da1e1c;
}
.status-label.appeal {
  background: #fcf4e2;
  color: #ffac00;
}
.status-label.draft {
  background: #fcf4e2;
  color: #ffac00;
}
.status-label.pending_payment {
  background: #fcf4e2;
  color: #ffac00;
}
.status-label.pending_activation {
  background: #fcf4e2;
  color: #ffac00;
}
.status-label.chatbot_paused {
  background: #efefef;
  color: #5c5e64;
}
.status-label.trial_period {
  background: #e6ebff;
  color: #273c8c;
}

.status-text {
  line-height: 1.3;
  white-space: nowrap;
}
</style>
