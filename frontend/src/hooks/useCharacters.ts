import { useCallback, useEffect, useRef, useState } from 'react'
import { charactersApi } from '../services/api/characters'
import { Character } from '../types/common'

interface CharacterGeneration {
  id: number
  workspace_id: number
  analysis_id?: number
  status: string
  created_at: string
  updated_at: string
}

export const useCharacters = (token: string | null, selectedWorkspace: string) => {
  const [characters, setCharacters] = useState<Character[]>([])
  const [characterGenerations, setCharacterGenerations] = useState<CharacterGeneration[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchCharacters = useCallback(async (workspaceId?: string) => {
    if (!token) return

    const workspaceToFetch = workspaceId || selectedWorkspace
    if (!workspaceToFetch) return

    try {
      const data = await charactersApi.fetchCharacters(token, workspaceToFetch)
      setCharacters(data)
    } catch (error) {
      console.error('Error fetching characters:', error)
    }
  }, [token, selectedWorkspace])

  const fetchCharacterGenerations = useCallback(async (workspaceId?: string) => {
    if (!token) return

    const workspaceToFetch = workspaceId || selectedWorkspace
    if (!workspaceToFetch) return

    try {
      const data = await charactersApi.fetchCharacterGenerations(token, workspaceToFetch)
      setCharacterGenerations(data)
    } catch (error) {
      console.error('Error fetching character generations:', error)
    }
  }, [token, selectedWorkspace])

  const generateCharacters = useCallback(async (brandAnalysis?: string) => {
    if (!token || !selectedWorkspace) return

    setLoading(true)
    setMessage('')

    try {
      const result = await charactersApi.generateCharacters(token, parseInt(selectedWorkspace), brandAnalysis)

      if (result.success) {
        setMessage('Character generation started! Check the results below for progress.')
        // Fetch generations immediately to show the new generation card
        await fetchCharacterGenerations(selectedWorkspace)
        // Don't fetch characters yet - they will be shown when generation completes
      } else {
        setMessage(result.error || 'Failed to start character generation')
      }
    } catch (error) {
      setMessage('Network error')
    } finally {
      setLoading(false)
    }
  }, [token, selectedWorkspace, fetchCharacterGenerations])

  const updateCharacterStatus = useCallback(async (characterId: string, status: 'approved' | 'discarded') => {
    if (!token) return

    try {
      const result = await charactersApi.updateCharacterStatus(token, characterId, status)

      if (result.success) {
        setMessage(`Character ${status} successfully!`)
        await fetchCharacters(selectedWorkspace)
      } else {
        setMessage(result.error || 'Failed to update character')
      }
    } catch (error) {
      setMessage('Network error')
    }
  }, [token, selectedWorkspace, fetchCharacters])

  // Polling effect for character generation updates
  useEffect(() => {
    if (selectedWorkspace && characterGenerations.some(cg => cg.status === 'processing' || cg.status === 'analyzing_brand_context' || cg.status === 'generating_characters' || cg.status === 'finalizing')) {
      if (!token) return

      // Start polling every 5 seconds
      const interval = setInterval(() => {
        fetchCharacterGenerations(selectedWorkspace)
        fetchCharacters(selectedWorkspace)
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
  }, [selectedWorkspace, characterGenerations, token, fetchCharacterGenerations, fetchCharacters])

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
    characters,
    characterGenerations,
    message,
    loading,
    fetchCharacters,
    fetchCharacterGenerations,
    generateCharacters,
    updateCharacterStatus,
    clearMessage,
  }
}
