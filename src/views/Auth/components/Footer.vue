<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const redirectPP = () => {
  router.push({ name: 'PrivacyPolicy' })
}

const redirectTos = () => {
  router.push({ name: 'TermsOfService' })
}
</script>

<template>
  <div class="d-flex flex-column align-items-center">
    <div class="d-flex flex-row justify-content-between limit-width">
      <a
        href="https://web.janustech.co/privacy-policy/"
        target="_blank"
        rel="noopener noreferrer"
        @click.stop
        class="small-text footer-text"
        >Privacy Policy</a
      >
      <a
        href="https://web.janustech.co/term-of-services/"
        target="_blank"
        rel="noopener noreferrer"
        @click.stop
        class="small-text footer-text"
        >Terms of Service</a
      >
    </div>

    <span class="small-text text-blue"> Copyright 2025 @Janus Digital Sdn Bhd </span>
  </div>
</template>

<style>
.limit-width {
  width: 100%;
  max-width: 14rem;
}

.center-align {
  text-align: center;
}

.footer-text {
  cursor: pointer;
  color: #374957;
  text-decoration: none;
}

.footer-text:hover {
  color: #f3541c;
}

.text-blue {
  color: #273c8c;
}
</style>
