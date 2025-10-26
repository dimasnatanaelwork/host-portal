<script lang="ts" setup>
import { useRouter } from 'vue-router'
import BackArrowIcon from '@/components/Icons/BackArrowIcon.vue'
import PrimaryBtn from '../Buttons/PrimaryBtn.vue'
import SecondaryBtn from '../Buttons/SecondaryBtn.vue'

const router = useRouter()

defineProps<{
  formTitle: string
  formTypeTitle: string
  saveBtnText?: string
}>()

const emit = defineEmits(['submit'])

function handleSubmit() {
  emit('submit')
}
</script>

<template>
  <div class="form-header-container">
    <div class="d-flex flex-row align-items-center py-3">
      <a @click="router.back()">
        <BackArrowIcon />
      </a>
      <h4 class="my-0 ms-3">{{ formTitle }}</h4>
      <h4 class="my-0 mx-1">&nbsp;>&nbsp;</h4>
      <h4 class="my-0" style="font-style: italic">{{ formTypeTitle }}</h4>
    </div>
    <div class="d-flex flex-row justify-content-end">
      <div class="my-2">
        <SecondaryBtn @click="router.back()" />
      </div>
      <div class="my-2 ms-3">
        <PrimaryBtn @click="handleSubmit" :btnText="saveBtnText ?? 'Save Changes'" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-header-container {
  display: flex;
  flex-direction: column;
}

@media (min-width: 1024px) {
  .form-header-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
