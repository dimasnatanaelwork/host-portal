import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    isSideNavShown: false,
  }),
  actions: {
    showSideNav() {
      this.isSideNavShown = true
    },
    hideSideNav() {
      this.isSideNavShown = false
    },
    toggleSideNav() {
      this.isSideNavShown = !this.isSideNavShown
    },
  },
})
