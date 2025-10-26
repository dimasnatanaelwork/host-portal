import { ref, watch } from 'vue'

const TOKEN_KEY = 'auth_token'
const PHONE_KEY = 'user_phone'

const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
const phone = ref<string | null>(localStorage.getItem(PHONE_KEY))

// Keep localStorage in sync with reactive token
watch([token, phone], ([newToken, newPhone]) => {
  if (newToken) {
    localStorage.setItem(TOKEN_KEY, newToken)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }

  if (newPhone) {
    localStorage.setItem(PHONE_KEY, newPhone)
  } else {
    localStorage.removeItem(PHONE_KEY)
  }
})

export function useAuthToken() {
  const setToken = (newToken: string | null) => {
    token.value = newToken
  }

  const setPhone = (newPhone: string | null) => {
    phone.value = newPhone
  }

  return {
    token,
    setToken,
    phone,
    setPhone,
  }
}
