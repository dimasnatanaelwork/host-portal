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
        <h1 class="my-0 mx-3">Privacy Policy</h1>
      </div>
    </div>
    <div class="medium-text">
      <p>
        <b>Janus Digital Sdn Bhd</b> ("we," "us," or "our") values your privacy and is committed to
        protecting your personal data. This Privacy Policy explains how we collect, use, and
        safeguard your information when you visit our website.
      </p>

      <h3>1. Website Usage</h3>
      <p>
        When you access our website, you may provide personal information such as your name, email
        address, phone number, and other details through contact forms, newsletter sign-ups, or
        account registrations.
      </p>
      <p>We may also automatically collect certain non-personal data including:</p>
      <ul>
        <li>IP address</li>
        <li>Browser type and version</li>
        <li>Pages visited and time spent</li>
        <li>Referring website URLs</li>
        <li>Device type and operating system</li>
      </ul>
      <p>
        This information helps us analyze traffic, improve user experience, and enhance website
        security.
      </p>

      <h3>2. Data Protection</h3>
      <p>
        We are committed to safeguarding your personal data and comply with Malaysian PDPA 2010.
      </p>
      <p><b>How we protect your data:</b></p>
      <ul>
        <li>Implement technical and organizational security measures</li>
        <li>Limit access to authorized personnel</li>
        <li>Regularly review security policies</li>
      </ul>
      <p><b>Use of your personal data:</b></p>
      <ul>
        <li>Respond to inquiries</li>
        <li>Send updates and marketing (with consent)</li>
        <li>Improve our services</li>
        <li>Comply with legal obligations</li>
      </ul>
      <p><b>Data sharing:</b></p>
      <p>
        We do not sell your data. We may share with trusted service providers under confidentiality
        agreements.
      </p>

      <h3>3. Your Rights</h3>
      <p>You have the right to:</p>
      <ul>
        <li>Access your personal data</li>
        <li>Request correction of data</li>
        <li>Request deletion (subject to legal requirements)</li>
        <li>Withdraw marketing consent</li>
      </ul>
      <p>
        Contact us at <a href="mailto:privacy@janusdigital.com">privacy@janusdigital.com</a> to
        exercise these rights.
      </p>

      <h3>4. Cookies</h3>
      <p>
        Our website uses cookies to enhance experience. You can refuse cookies via browser settings,
        but some features may not work properly.
      </p>

      <h3>5. Changes to this Policy</h3>
      <p>We may update this policy periodically. Please review this page for changes.</p>

      <h3>6. Contact Us</h3>
      <p>For questions about this policy:</p>
      <p>
        <b>Janus Digital Sdn Bhd</b><br />
        Email: <a href="mailto:privacy@janusdigital.com">privacy@janusdigital.com</a><br />
        Phone: +60 19 354 1593
      </p>
    </div>
  </div>
</template>
