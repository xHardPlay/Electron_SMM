import { useState } from 'react'

interface WorkspaceFormProps {
  onCreateWorkspace: (name: string) => void
  loading: boolean
}

export default function WorkspaceForm({ onCreateWorkspace, loading }: WorkspaceFormProps) {
  const [newWorkspaceName, setNewWorkspaceName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newWorkspaceName.trim()) return
    onCreateWorkspace(newWorkspaceName)
    setNewWorkspaceName('')
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold mb-4">Create New Workspace</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="workspaceName" className="block text-sm font-medium mb-1">
            Workspace Name
          </label>
          <input
            type="text"
            id="workspaceName"
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter workspace name"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Workspace'}
        </button>
      </form>
    </div>
  )
}
