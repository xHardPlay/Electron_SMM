import { useCallback, useState } from 'react'
import { imagesApi } from '../services/api/images'
import { CharacterImage } from '../types/common'

export const useCharacterImages = (token: string | null, selectedWorkspace: string) => {
  const [characterImages, setCharacterImages] = useState<CharacterImage[]>([])

  const fetchCharacterImages = useCallback(async (workspaceId?: string) => {
    if (!token) return

    const workspaceToFetch = workspaceId || selectedWorkspace
    if (!workspaceToFetch) return

    try {
      const data = await imagesApi.fetchCharacterImages(token, workspaceToFetch)
      setCharacterImages(data)
    } catch (error) {
      console.error('Error fetching character images:', error)
    }
  }, [token, selectedWorkspace])

  return {
    characterImages,
    fetchCharacterImages,
  }
}
