import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: false,
  }),
  actions: {
    setLoading(condition: boolean) {
      this.isLoading = condition
    },
    // setLoadingFalse() {
    //   this.isLoading = false
    // },
    // toggleLoading() {
    //   this.isLoading = !this.isLoading
    // },
  },
})
