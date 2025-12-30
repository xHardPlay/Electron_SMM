import { useCallback, useState } from 'react'
import { adsApi } from '../services/api/ads'
import { Ad } from '../types/common'

export const useAds = (token: string | null, selectedWorkspace: string) => {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string>('')

  const fetchAds = useCallback(async (workspaceId?: string) => {
    if (!token) return

    const workspaceToFetch = workspaceId || selectedWorkspace
    if (!workspaceToFetch) return

    try {
      const data = await adsApi.fetchAds(token, workspaceToFetch)
      setAds(data)
    } catch (error) {
      console.error('Error fetching ads:', error)
    }
  }, [token, selectedWorkspace])

  const generateAds = useCallback(async (characterIds: number[], adType: string, topic: string, quantity: number) => {
    if (!token || !selectedWorkspace) return

    setLoading(true)
    setMessage('')

    try {
      await adsApi.generateAds(token, selectedWorkspace, characterIds, adType, topic, quantity)
      setMessage('Ad generation started. Ads will be available shortly.')
      // Refresh ads after a delay to show new ones
      setTimeout(() => fetchAds(), 3000)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to generate ads')
    } finally {
      setLoading(false)
    }
  }, [token, selectedWorkspace, fetchAds])

  const clearMessage = useCallback(() => setMessage(''), [])

  return {
    ads,
    loading,
    message,
    fetchAds,
    generateAds,
    clearMessage,
  }
}
