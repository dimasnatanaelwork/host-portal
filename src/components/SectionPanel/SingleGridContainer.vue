<script lang="ts" setup>
import TagComponent from '../Tag/TagComponent.vue'

defineProps<{
  hasActivePlan: boolean
  price: string
  note?: string
  description: string
  hasBody?: boolean
}>()
</script>

<template>
  <div class="card w-100 h-100 selected">
    <template v-if="hasActivePlan">
      <TagComponent class="card-tag-position">
        <template #tagContent>
          <span class="small-text fw-600">Current</span>
        </template>
      </TagComponent>
    </template>
    <template v-else>
      <div class="check-mark">&#x2713;</div>
    </template>

    <h2 class="price">{{ price }}</h2>
    <div class="d-inline-block">
      <small class="note fw-600" v-if="note">{{ note }}</small>
    </div>
    <p class="description">{{ description }}</p>

    <div class="mt-3" v-if="hasBody">
      <slot name="bodyContent"></slot>
    </div>
  </div>
</template>

<style scoped>
.card {
  flex: 0 0 auto;
  border: 0.15rem solid #ddd;
  border-radius: 1rem;
  padding: 16px;
  width: 200px;
  position: relative;
  cursor: pointer;
  scroll-snap-align: start;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}

.card.selected {
  border-color: #273c8c;
  border-width: 0.15rem;
}

.card.disabled {
  pointer-events: none;
  opacity: 0.6;
  cursor: not-allowed !important;
}

.check-mark {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #273c8c;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.check-mark-unselected {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: transparent;
  color: #d9d9d9;
  border-color: #d9d9d9;
  border-width: 0.1rem;
  border-style: solid;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.card-tag-position {
  position: absolute;
  top: 12px;
  right: 12px;
}

.price {
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 4px;
}

.description {
  font-weight: 600;
  margin-bottom: 8px;
}

.note {
  display: inline-block;
  background-color: #ebfcf2;
  color: #1d9436;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
