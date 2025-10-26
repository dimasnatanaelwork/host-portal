<script lang="ts" setup>
import BackArrowIcon from '@/components/Icons/BackArrowIcon.vue'
import { useDashboardStore } from '@/stores/dashboardItems'
import { useRouter } from 'vue-router'

const router = useRouter()

const dashboardStore = useDashboardStore()
dashboardStore.hideSideNav()
</script>

<template>
  <div class="container">
    <div style="display: flex; flex-direction: row">
      <div class="d-flex flex-row align-items-center py-3">
        <a @click="router.back()">
          <BackArrowIcon />
        </a>
        <h1 class="my-0 mx-3">Terms of Service</h1>
      </div>
    </div>
    <div class="medium-text">
      <p>
        Welcome to <b>Janus Digital Sdn Bhd</b> ("we," "us," "our"). By using our website, you agree
        to these terms. If you disagree, please do not use our site.
      </p>

      <h3>1. Use of Website</h3>
      <p>You agree to use this website lawfully. You must not:</p>
      <ul>
        <li>Violate any laws or regulations</li>
        <li>Attempt unauthorized access to our systems</li>
        <li>Disrupt website functionality or security</li>
        <li>Transmit harmful code or viruses</li>
      </ul>

      <h3>2. Intellectual Property</h3>
      <p>
        All website content (text, images, logos, etc.) belongs to Janus Digital Sdn Bhd. You may
        not reproduce or use any content without our written permission.
      </p>

      <h3>3. Limitation of Liability</h3>
      <p>
        While we strive for accuracy, we don't guarantee all content is complete or reliable. We're
        not liable for any damages from your use of this website.
      </p>

      <h3>4. Third-Party Links</h3>
      <p>
        Our site may contain external links for convenience. We're not responsible for third-party
        content or privacy practices.
      </p>

      <h3>5. Account Registration</h3>
      <p>
        If you create an account, you're responsible for keeping your login secure and for all
        account activity. Notify us immediately of any unauthorized use.
      </p>

      <h3>6. Changes to the Terms</h3>
      <p>
        We may update these terms anytime without notice. Continued use after changes means you
        accept the new terms.
      </p>

      <h3>7. Governing Law</h3>
      <p>
        These terms are governed by <b>Malaysian law</b>, and you agree to Malaysian courts'
        exclusive jurisdiction.
      </p>

      <h3>8. Contact Us</h3>
      <p>For questions about these terms:</p>
      <p>
        <b>Janus Digital Sdn Bhd</b><br />
        Email: <a href="mailto:legal@janusdigital.com">legal@janusdigital.com</a><br />
        Phone: +60 19 354 1593
      </p>
    </div>
  </div>
</template>
