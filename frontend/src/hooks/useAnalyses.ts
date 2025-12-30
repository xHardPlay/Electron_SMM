import { useCallback, useEffect, useRef, useState } from 'react'
import { analysesApi } from '../services/api/analyses'
import { Analysis } from '../types/common'

export const useAnalyses = (token: string | null, selectedWorkspace: string) => {
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchAnalyses = useCallback(async (workspaceId?: string) => {
    if (!token) return

    const workspaceToFetch = workspaceId || selectedWorkspace
    if (!workspaceToFetch) return

    try {
      const data = await analysesApi.fetchAnalyses(token, workspaceToFetch)
      setAnalyses(data)
    } catch (error) {
      console.error('Error fetching analyses:', error)
    }
  }, [token, selectedWorkspace])

  const startAnalysis = useCallback(async (
    workspaceId: string,
    analysisType: 'brand' | 'product',
    name: string,
    urls: string[],
    processedFiles: any[]
  ) => {
    if (!token) return

    setLoading(true)
    setMessage('')

    try {
      const result = await analysesApi.createAnalysis(token, workspaceId, analysisType, name, urls, processedFiles)

      if (result.success) {
        setMessage('Brand/Product discovery started! Analysis will be available shortly.')
        await fetchAnalyses(workspaceId) // Refresh the list
      } else {
        setMessage(result.error || 'Failed to start analysis')
      }
    } catch (error) {
      setMessage('Network error')
    } finally {
      setLoading(false)
    }
  }, [token, fetchAnalyses])

  const deleteAnalysis = useCallback(async (analysisId: string) => {
    if (!token) return

    try {
      const result = await analysesApi.deleteAnalysis(token, analysisId)

      if (result.success) {
        setMessage('Analysis deleted successfully!')
        // Refresh analyses after deletion
        if (selectedWorkspace) {
          await fetchAnalyses(selectedWorkspace)
        }
      } else {
        setMessage(result.error || 'Failed to delete analysis')
      }
    } catch (error) {
      setMessage('Network error')
    }
  }, [token, selectedWorkspace, fetchAnalyses])

  // Polling effect for analysis updates
  useEffect(() => {
    if (selectedWorkspace && analyses.some(a => a.status === 'processing' || a.status === 'analyzing_content' || a.status === 'processing_ai' || a.status === 'parsing_results' || a.status === 'finalizing')) {
      if (!token) return

      // Start polling every 5 seconds
      const interval = setInterval(() => {
        fetchAnalyses(selectedWorkspace)
      }, 5000)

      pollingIntervalRef.current = interval

      return () => {
        clearInterval(interval)
        pollingIntervalRef.current = null
      }
    } else if (pollingIntervalRef.current) {
      // Clear polling when no analyses are processing
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [selectedWorkspace, analyses, token, fetchAnalyses])

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
    analyses,
    loading,
    message,
    fetchAnalyses,
    startAnalysis,
    deleteAnalysis,
    clearMessage,
  }
}
