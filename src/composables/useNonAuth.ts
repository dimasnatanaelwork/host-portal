import { useAuthToken } from '@/stores/useAuthToken'
import { useRouter } from 'vue-router'

export function useNonAuth() {
  const router = useRouter()
  const { token } = useAuthToken()

  const handleReroute = () => {
    // clear token so app knows user is logged out
    token.value = null
    localStorage.removeItem('authToken')

    // redirect to login page
    router.push({ name: 'auth' })
  }

  return {
    handleReroute,
  }
}
