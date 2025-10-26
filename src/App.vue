<script setup lang="ts">
import { useDashboardStore } from './stores/dashboardItems'
import Sidenav from './components/Sidenav/Sidenav.vue'
import LoadingScreen from './components/Loading/LoadingScreen.vue'
import { useLoadingStore } from './stores/loadingStore'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import HamburgerMenuRight from './components/Icons/HamburgerMenuRight.vue'
import { useRoute } from 'vue-router'

const loadingStore = useLoadingStore()
const dashboardStore = useDashboardStore()
const windowWidth = ref(0)
const route = useRoute()
const currentRouteName = computed(() => route.name)

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    windowWidth.value = window.innerWidth
    window.addEventListener('resize', handleResize)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize)
  }
})

const isMobile = ref<boolean>(false)

watch(windowWidth, (newWidth) => {
  if (newWidth > 1200) {
    dashboardStore.showSideNav()
    isMobile.value = false
  } else {
    dashboardStore.hideSideNav()
    isMobile.value = true
  }
})

const handleOverlayClick = () => {
  if (isMobile.value) {
    dashboardStore.hideSideNav()
  }
}

const handleMenuItemClick = () => {
  if (isMobile.value) {
    dashboardStore.hideSideNav()
  }
}

const showOverlay = computed(() => {
  return (
    isMobile.value &&
    dashboardStore.isSideNavShown &&
    currentRouteName.value != 'auth' &&
    currentRouteName.value != 'PrivacyPolicy' &&
    currentRouteName.value != 'TermsOfService' &&
    currentRouteName.value != 'PaymentProcessDone'
  )
})
</script>

<template>
  <LoadingScreen v-if="loadingStore.isLoading" />

  <!-- Dark Overlay -->
  <div v-if="showOverlay" class="overlay" @click="handleOverlayClick"></div>

  <Sidenav
    v-if="
      dashboardStore.isSideNavShown &&
      currentRouteName != 'auth' &&
      currentRouteName != 'PrivacyPolicy' &&
      currentRouteName != 'TermsOfService' &&
      currentRouteName != 'PaymentProcessDone'
    "
    :isMobile="isMobile"
    @menuItemClick="handleMenuItemClick"
  />
  <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
    <template
      v-if="
        isMobile &&
        currentRouteName != 'auth' &&
        currentRouteName != 'PrivacyPolicy' &&
        currentRouteName != 'TermsOfService' &&
        currentRouteName != 'PaymentProcessDone'
      "
    >
      <div class="container hamburger-menu">
        <HamburgerMenuRight @click="dashboardStore.toggleSideNav()" />
      </div>
    </template>

    <router-view />
  </main>
</template>

<style scoped>
.hamburger-menu {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 900;
  cursor: pointer;
}
</style>
