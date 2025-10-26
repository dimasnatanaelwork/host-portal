<script setup lang="ts">
import SidenavItem from './SidenavItem.vue'
import logo from '@/assets/logo/janus_logo.png'
import propertyPersonaIcon from '@/assets/icons/property-persona-icon.png'
import logoutIcon from '@/assets/icons/logout-icon.png'
import AiChatbotIcon from '../Icons/AiChatbotIcon.vue'
import { logout } from '@/services/authService'
import { useRouter, useRoute } from 'vue-router'
import BookingIcon from '../Icons/BookingIcon.vue'
import SidenavExpandableItem from './SidenavExpandableItem.vue'
import SubscriptionsIcon from '../Icons/sidenav/SubscriptionsIcon.vue'
import SubmenuItem from './SubmenuItem.vue'

interface Props {
  isMobile?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isMobile: false,
})

const emit = defineEmits<{
  menuItemClick: []
}>()

const router = useRouter()
const route = useRoute()

const isActive = (to: string) => {
  return route.path.startsWith(to)
}

const signout = async () => {
  try {
    await logout()
  } catch (e) {
    console.log(e)
  } finally {
    router.push('/')
  }
}

const handleMenuItemClick = () => {
  if (props.isMobile) {
    emit('menuItemClick')
  }
}
</script>

<template>
  <aside class="sidenav aside-style bg-white fixed-start" id="sidenav-main">
    <div class="sidenav-header p-4 text-center">
      <i
        class="top-0 p-3 cursor-pointer fas fa-times text-secondary opacity-5 position-absolute end-0 d-none d-xl-none"
        aria-hidden="true"
        id="iconSidenav"
      ></i>
      <router-link class="m-0 navbar-brand" to="/ai-chatbot" @click="handleMenuItemClick">
        <img :src="logo" alt="Logo" style="width: 100%" />
      </router-link>
    </div>

    <hr class="mt-0 horizontal dark" />

    <div class="scrollable-vert">
      <span class="medium-text sidenav-section-title">Main</span>

      <!-- menu list -->
      <div class="w-auto h-auto h-100" id="sidenav-collapse-main">
        <ul class="navbar-nav">
          <li class="nav-item">
            <SidenavItem
              to="/ai-chatbot"
              :backgroundColor="isActive('/ai-chatbot') ? '#f6f6f6' : 'transparent'"
              navText="AI Chatbot"
              :isBordered="false"
              @click="handleMenuItemClick"
            >
              <template v-slot:icon>
                <AiChatbotIcon />
              </template>
            </SidenavItem>
          </li>
          <li class="nav-item">
            <SidenavItem
              to="/booking"
              :backgroundColor="isActive('/booking') ? '#f6f6f6' : 'transparent'"
              navText="Bookings"
              :isBordered="false"
              @click="handleMenuItemClick"
            >
              <template v-slot:icon>
                <BookingIcon />
              </template>
            </SidenavItem>
          </li>
          <li class="nav-item">
            <SidenavExpandableItem
              :backgroundColor="
                isActive('/subscription') || isActive('/plan-and-pricing') || isActive('/billing')
                  ? '#f6f6f6'
                  : 'transparent'
              "
              navText="Subscriptions"
              :isBordered="false"
            >
              <template v-slot:icon>
                <SubscriptionsIcon />
              </template>
              <template v-slot:bodyContent>
                <ul class="navbar-nav">
                  <li class="navbar-item">
                    <SubmenuItem
                      to="/subscription"
                      :backgroundColor="isActive('/subscription') ? '#f6f6f6' : 'transparent'"
                      navText="Your Subscriptions"
                      @click="handleMenuItemClick"
                    />
                  </li>
                  <li class="navbar-item">
                    <SubmenuItem
                      to="/billing"
                      :backgroundColor="isActive('/billing') ? '#f6f6f6' : 'transparent'"
                      navText="Billing"
                      @click="handleMenuItemClick"
                    />
                  </li>
                  <li class="navbar-item">
                    <SubmenuItem
                      to="/plan-and-pricing/0/subscribe"
                      :backgroundColor="isActive('/plan-and-pricing') ? '#f6f6f6' : 'transparent'"
                      navText="Plan & Pricing"
                      @click="handleMenuItemClick"
                    />
                  </li>
                </ul>
              </template>
            </SidenavExpandableItem>
          </li>
        </ul>
      </div>
    </div>

    <!-- sidebar footer -->
    <div class="sidenav-footer py-4">
      <div
        class="d-flex flex-row justify-content-start"
        style="
          background-color: #ffffff;
          border: 1px solid #d9d9d9;
          margin-right: 1rem;
          margin-left: 1rem;
          padding: 1rem 1.5rem 1rem 1.5rem;
          border-radius: 1rem;
          cursor: pointer;
        "
        @click.stop="signout"
      >
        <div
          class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center"
        >
          <img :src="logoutIcon" alt="Logo" style="height: 20px" />
        </div>
        <span class="nav-link-text ms-2 medium-text">Logout</span>
      </div>
      <div class="sidenav-footer-btn d-flex flex-row justify-content-between"></div>
    </div>
  </aside>
</template>

<style>
.aside-style {
  left: 0;
  display: block;
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  max-width: 15.625rem !important;
  overflow-y: auto;
  padding: 0;
  box-shadow: none;
  z-index: 9999;
  border-right: 1px solid #d9d9d9;
}

.sidenav-header {
  background-color: #fafafa;
}

.scrollable-vert {
  max-height: calc(100vh - 13.125rem);
  /* max-height: 100vh; */
  overflow-y: auto;
}

.sidenav-section-title {
  margin-right: 1rem;
  margin-left: 1rem;
}

.sidenav-footer {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  border-top: 1px solid #d9d9d9;
  background-color: #fafafa;
}
</style>
