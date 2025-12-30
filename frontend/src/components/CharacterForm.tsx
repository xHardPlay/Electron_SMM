import { useState } from 'react'

interface Workspace {
  id: number
  name: string
  created_at: string
}

interface CharacterFormProps {
  workspaces: Workspace[]
  selectedWorkspace: string
  onWorkspaceSelect: (workspaceId: string) => void
  onGenerateCharacters: () => void
  onUploadImage: (image: File) => void
  loading: boolean
}

export default function CharacterForm({
  workspaces,
  selectedWorkspace,
  onWorkspaceSelect,
  onGenerateCharacters,
  onUploadImage,
  loading,
}: CharacterFormProps) {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)

  const handleImageUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (uploadedImage) {
      onUploadImage(uploadedImage)
      setUploadedImage(null)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold mb-4">Create Brand Voice Characters</h3>
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-4">
          Upload images and generate AI characters based on your brand analysis.
          Images will be associated with your characters for later use.
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Selected Workspace
          </label>
          <select
            value={selectedWorkspace}
            onChange={(e) => onWorkspaceSelect(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Choose a workspace...</option>
            {workspaces.map((workspace) => (
              <option key={workspace.id} value={workspace.id.toString()}>
                {workspace.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="characterImageUpload" className="block text-sm font-medium mb-1">
            Upload Character Images (Optional)
          </label>
          <input
            type="file"
            id="characterImageUpload"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={(e) => setUploadedImage(e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: JPEG, PNG, GIF, WebP (max 5MB each)
          </p>
          {uploadedImage && (
            <p className="text-sm text-green-600 mt-1">
              Selected: {uploadedImage.name} ({(uploadedImage.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>
        <div className="flex gap-4">
          <button
            onClick={onGenerateCharacters}
            disabled={loading || !selectedWorkspace}
            className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {loading ? 'Generating Characters...' : 'Generate Characters'}
          </button>
          {uploadedImage && (
            <button
              onClick={handleImageUpload}
              disabled={loading}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload Image'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
