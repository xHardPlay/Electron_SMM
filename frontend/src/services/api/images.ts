import { CharacterImage } from '../../types/common'

const API_BASE = 'https://electron-backend.carlos-mdtz9.workers.dev/api'

export const imagesApi = {
  async fetchCharacterImages(token: string, workspaceId: string): Promise<CharacterImage[]> {
    try {
      const response = await fetch(`${API_BASE}/character-images?workspace_id=${workspaceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        return data.images || []
      } else {
        console.error('Failed to fetch character images')
        return []
      }
    } catch (error) {
      console.error('Error fetching character images:', error)
      throw error
    }
  },
}
