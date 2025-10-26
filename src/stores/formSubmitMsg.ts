import { defineStore } from 'pinia'

export const useFormSubmitMsgStore = defineStore('formSubmitMsg', {
  state: () => ({
    submitMessageStatus: '',
  }),
  actions: {
    setMessageStatus(status: string) {
      this.submitMessageStatus = status
      setTimeout(() => {
        this.submitMessageStatus = ''
      }, 6000)
    },
  },
})
