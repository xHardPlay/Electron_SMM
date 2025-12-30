import { useCallback, useState } from 'react'
import { workspacesApi } from '../services/api/workspaces'
import { Workspace } from '../types/common'

export const useWorkspaces = (token: string | null) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState('')

  const fetchWorkspaces = useCallback(async () => {
    if (!token) return

    try {
      const data = await workspacesApi.fetchWorkspaces(token)
      setWorkspaces(data)
    } catch (error) {
      console.error('Error fetching workspaces:', error)
    }
  }, [token])

  const createWorkspace = useCallback(async (name?: string) => {
    const workspaceName = name || newWorkspaceName
    if (!token || !workspaceName.trim()) return

    setLoading(true)
    setMessage('')

    try {
      const result = await workspacesApi.createWorkspace(token, workspaceName.trim())

      if (result.success) {
        setMessage('Workspace created successfully!')
        setNewWorkspaceName('')
        setShowCreateForm(false)
        await fetchWorkspaces() // Refresh the list
      } else {
        setMessage(result.error || 'Failed to create workspace')
      }
    } catch (error) {
      setMessage('Network error')
    } finally {
      setLoading(false)
    }
  }, [token, newWorkspaceName, fetchWorkspaces])

  const deleteWorkspace = useCallback(async (workspaceId: string, workspaceName: string) => {
    if (!token) return

    const confirmed = window.confirm(
      `Are you sure you want to delete the workspace "${workspaceName}"?\n\nThis will permanently delete all analyses, characters, ads, and images associated with this workspace. This action cannot be undone.`
    )

    if (!confirmed) return

    try {
      const result = await workspacesApi.deleteWorkspace(token, workspaceId)

      if (result.success) {
        setMessage('Workspace deleted successfully!')
        await fetchWorkspaces() // Refresh the list
      } else {
        setMessage(result.error || 'Failed to delete workspace')
      }
    } catch (error) {
      setMessage('Network error')
    }
  }, [token, fetchWorkspaces])

  const clearMessage = useCallback(() => {
    setMessage('')
  }, [])

  return {
    workspaces,
    loading,
    message,
    showCreateForm,
    newWorkspaceName,
    setShowCreateForm,
    setNewWorkspaceName,
    fetchWorkspaces,
    createWorkspace,
    deleteWorkspace,
    clearMessage,
  }
}
