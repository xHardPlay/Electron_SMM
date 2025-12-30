import { Workspace } from '../../types/common'

const API_BASE = 'https://electron-backend.carlos-mdtz9.workers.dev/api'

export const workspacesApi = {
  async fetchWorkspaces(token: string): Promise<Workspace[]> {
    try {
      const response = await fetch(`${API_BASE}/workspaces`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        return data.workspaces || []
      } else {
        console.error('Failed to fetch workspaces')
        return []
      }
    } catch (error) {
      console.error('Error fetching workspaces:', error)
      throw error
    }
  },

  async createWorkspace(token: string, name: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/workspaces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Failed to create workspace' }
      }
    } catch (error) {
      console.error('Error creating workspace:', error)
      return { success: false, error: 'Network error' }
    }
  },

  async deleteWorkspace(token: string, workspaceId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/workspaces/${workspaceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        return { success: true }
      } else {
        const data = await response.json()
        return { success: false, error: data.error || 'Failed to delete workspace' }
      }
    } catch (error) {
      console.error('Error deleting workspace:', error)
      return { success: false, error: 'Network error' }
    }
  },
}
