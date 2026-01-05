import { Character } from '../../types/common'

const API_BASE = 'https://electron-backend.carlos-mdtz9.workers.dev/api'

export const charactersApi = {
  async fetchCharacters(token: string, workspaceId: string): Promise<Character[]> {
    try {
      const response = await fetch(`${API_BASE}/characters?workspace_id=${workspaceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        return data.characters || []
      } else {
        console.error('Failed to fetch characters')
        return []
      }
    } catch (error) {
      console.error('Error fetching characters:', error)
      throw error
    }
  },

  async generateCharacters(
    token: string,
    workspaceId: number,
    brandAnalysis?: string
  ): Promise<{ success: boolean; error?: string; characters_generated?: number }> {
    try {
      const response = await fetch(`${API_BASE}/character-generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          workspace_id: workspaceId,
          analysis_id: brandAnalysis ? parseInt(brandAnalysis) : undefined,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return {
          success: true,
          characters_generated: 0 // Will be shown via generation status
        }
      } else {
        const data = await response.json()
        return { success: false, error: data.error || 'Failed to start character generation' }
      }
    } catch (error) {
      console.error('Error starting character generation:', error)
      return { success: false, error: 'Network error' }
    }
  },

  async fetchCharacterGenerations(token: string, workspaceId: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE}/character-generations?workspace_id=${workspaceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        return data.generations || []
      } else {
        console.error('Failed to fetch character generations')
        return []
      }
    } catch (error) {
      console.error('Error fetching character generations:', error)
      throw error
    }
  },

  async updateCharacterStatus(
    token: string,
    characterId: string,
    status: 'approved' | 'discarded'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/characters/${characterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        return { success: true }
      } else {
        const data = await response.json()
        return { success: false, error: data.error || 'Failed to update character' }
      }
    } catch (error) {
      console.error('Error updating character:', error)
      return { success: false, error: 'Network error' }
    }
  },
}
