
interface Workspace {
  id: number
  name: string
  created_at: string
}

interface WorkspaceSidebarProps {
  workspaces: Workspace[]
  selectedWorkspace: string
  onWorkspaceSelect: (workspaceId: string) => void
  onDeleteWorkspace: (workspaceId: string, workspaceName: string) => void
  onCreateWorkspace: () => void
}

export default function WorkspaceSidebar({
  workspaces,
  selectedWorkspace,
  onWorkspaceSelect,
  onDeleteWorkspace,
  onCreateWorkspace,
}: WorkspaceSidebarProps) {
  return (
    <div className="w-64 bg-gray-800 text-white p-6">
      <h2 className="text-2xl font-bold mb-6">Workspaces</h2>
      <div className="space-y-2">
        {workspaces.map((workspace) => (
          <div key={workspace.id} className="flex items-center">
            <button
              onClick={() => onWorkspaceSelect(workspace.id.toString())}
              className={`flex-1 text-left px-4 py-2 rounded-l-md hover:bg-gray-700 ${
                selectedWorkspace === workspace.id.toString() ? 'bg-gray-700' : ''
              }`}
            >
              {workspace.name}
            </button>
            <button
              onClick={() => onDeleteWorkspace(workspace.id.toString(), workspace.name)}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-r-md"
              title="Delete workspace"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={onCreateWorkspace}
        className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        + New Workspace
      </button>
    </div>
  )
}
