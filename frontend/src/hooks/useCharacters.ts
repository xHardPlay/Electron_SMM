import { useCallback, useState } from 'react'
import { charactersApi } from '../services/api/characters'
import { Character } from '../types/common'

export const useCharacters = (token: string | null, selectedWorkspace: string) => {
  const [characters, setCharacters] = useState<Character[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

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

  const generateCharacters = useCallback(async (brandAnalysis?: string) => {
    if (!token || !selectedWorkspace) return

    setLoading(true)
    setMessage('')

    try {
      const result = await charactersApi.generateCharacters(token, parseInt(selectedWorkspace), brandAnalysis)

      if (result.success) {
        setMessage(`Successfully generated ${result.characters_generated || 0} characters!`)
        await fetchCharacters(selectedWorkspace)
      } else {
        setMessage(result.error || 'Failed to generate characters')
      }
    } catch (error) {
      setMessage('Network error')
    } finally {
      setLoading(false)
    }
  }, [token, selectedWorkspace, fetchCharacters])

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

  const clearMessage = useCallback(() => {
    setMessage('')
  }, [])

  return {
    characters,
    message,
    loading,
    fetchCharacters,
    generateCharacters,
    updateCharacterStatus,
    clearMessage,
  }
}
