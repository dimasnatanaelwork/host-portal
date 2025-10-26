<script lang="ts" setup>
import AuthBtn from '@/components/Buttons/AuthBtn.vue'
import PhoneNumberInput from '@/components/Form/PhoneNumberInput.vue'
import type { LoginForm } from '@/interfaces/auth'

const props = defineProps<{
  form: LoginForm
  errors: { mobile_no?: string }
  loginLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'submit'): void
}>()

function onSubmit() {
  emit('submit')
}
</script>

<template>
  <div class="my-3">
    <h3 class="mb-3">Welcome Back 👋</h3>
    <div class="mb-3">
      <span class="medium-text">
        Today is a new day. It's your day. You shape it. Sign in to start managing your projects.
      </span>
    </div>

    <form @submit.prevent="onSubmit">
      <div class="mb-3">
        <div style="width: 100%">
          <PhoneNumberInput
            :countryCode="form.country_code"
            :phoneNumber="form.mobile_no"
            @update:countryCode="(val) => (form.country_code = val)"
            @update:phoneNumber="(val) => (form.mobile_no = val)"
          />
        </div>
        <div v-if="props.errors.mobile_no" class="text-danger">
          {{ props.errors.mobile_no }}
        </div>
      </div>
      <!-- <button type="submit" class="btn w-100" style="background-color: #202224; color: white">
        Continue
      </button> -->
      <AuthBtn btn_text="Continue" :btn_func="onSubmit" :isLoading="loginLoading" />
    </form>
  </div>
</template>
