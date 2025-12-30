import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export const useAuth = () => {
  const [userId, setUserId] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUserId = localStorage.getItem('userId')

    if (!storedToken || !storedUserId) {
      router.push('/login')
      setIsLoading(false)
      return
    }

    setToken(storedToken)
    setUserId(storedUserId)
    setIsLoading(false)
  }, [router])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    setToken(null)
    setUserId(null)
    router.push('/')
  }

  return {
    userId,
    token,
    isLoading,
    isAuthenticated: !!token && !!userId,
    logout,
  }
}
