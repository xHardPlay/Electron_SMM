import { Ad } from '../../types/common'

const API_BASE = 'https://electron-backend.carlos-mdtz9.workers.dev/api'

export const adsApi = {
  async fetchAds(token: string, workspaceId: string): Promise<Ad[]> {
    try {
      const response = await fetch(`${API_BASE}/ads?workspace_id=${workspaceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        return data.ads || []
      } else {
        console.error('Failed to fetch ads')
        return []
      }
    } catch (error) {
      console.error('Error fetching ads:', error)
      throw error
    }
  },

  async fetchAdGenerations(token: string, workspaceId: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE}/ad-generations?workspace_id=${workspaceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        return data.generations || []
      } else {
        console.error('Failed to fetch ad generations')
        return []
      }
    } catch (error) {
      console.error('Error fetching ad generations:', error)
      throw error
    }
  },

  async generateAds(token: string, workspaceId: string, characterIds: number[], adType: string, topic: string, quantity: number, contentMix?: { education: number; story: number; proof: number; promotion: number }): Promise<any> {
    try {
      const requestBody: any = {
        workspace_id: parseInt(workspaceId),
        character_ids: characterIds,
        ad_type: adType,
        topic,
        quantity,
      };

      if (contentMix) {
        requestBody.content_mix = contentMix;
      }

      const response = await fetch(`${API_BASE}/ads/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (response.ok) {
        return await response.json()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate ads')
      }
    } catch (error) {
      console.error('Error generating ads:', error)
      throw error
    }
  },
}
