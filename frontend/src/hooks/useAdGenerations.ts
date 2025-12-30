import { useCallback, useEffect, useRef, useState } from 'react'
import { adsApi } from '../services/api/ads'

export const useAdGenerations = (token: string | null, selectedWorkspace: string) => {
  const [generations, setGenerations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchGenerations = useCallback(async (workspaceId?: string) => {
    if (!token) return

    const workspaceToFetch = workspaceId || selectedWorkspace
    if (!workspaceToFetch) return

    try {
      const data = await adsApi.fetchAdGenerations(token, workspaceToFetch)
      setGenerations(data)
    } catch (error) {
      console.error('Error fetching ad generations:', error)
    }
  }, [token, selectedWorkspace])

  // Polling effect for generation updates
  useEffect(() => {
    if (selectedWorkspace && generations.some(g => g.status === 'processing' || g.status === 'preparing_brand_context' || g.status === 'analyzing_brand_data' || g.status === 'planning_content_mix' || g.status === 'generating_content')) {
      if (!token) return

      // Start polling every 5 seconds
      const interval = setInterval(() => {
        fetchGenerations(selectedWorkspace)
      }, 5000)

      pollingIntervalRef.current = interval

      return () => {
        clearInterval(interval)
        pollingIntervalRef.current = null
      }
    } else if (pollingIntervalRef.current) {
      // Clear polling when no generations are processing
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [selectedWorkspace, generations, token, fetchGenerations])

  const clearMessage = useCallback(() => {
    setMessage('')
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [])

  return {
    generations,
    loading,
    message,
    fetchGenerations,
    clearMessage,
  }
}
