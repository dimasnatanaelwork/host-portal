<script lang="ts" setup>
import { ref } from 'vue'

interface Plan {
  id: number
  price: string
  description: string
  note?: string
}

const plans = ref<Plan[]>([
  { id: 1, price: 'RM399/mth', description: 'Hospitality plan' },
  { id: 2, price: 'RM4,788/year', description: 'Hospitality plan', note: 'Free 2 month access' },
])

const selectedPlan = ref<number>(1)

function selectPlan(id: number) {
  selectedPlan.value = id
}
</script>

<template>
  <div class="slider-container">
    <div
      v-for="(plan, index) in plans"
      :key="index"
      class="card"
      :class="{ selected: selectedPlan === plan.id }"
      @click="selectPlan(plan.id)"
    >
      <div class="check-mark" v-if="selectedPlan === plan.id">&#x2713;</div>
      <h2 class="price">{{ plan.price }}</h2>
      <p class="description">{{ plan.description }}</p>
      <small class="note" v-if="plan.note">{{ plan.note }}</small>
    </div>
  </div>
</template>

<style scoped>
.slider-container {
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding: 16px;
  scroll-snap-type: x mandatory;
}
.card {
  flex: 0 0 auto;
  border: 1px solid #ddd;
  border-radius: 8px;
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
  border-color: #1e40af;
  box-shadow: 0 0 8px #1e40afa0;
}
.check-mark {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #1e40af;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
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
  background-color: #d1fae5;
  color: #065f46;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
