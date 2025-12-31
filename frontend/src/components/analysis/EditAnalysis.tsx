import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { analysesApi } from '../../services/api/analyses'

interface EditAnalysisProps {
  analysisId: string
  initialContent: string
  onSave: () => void
  onCancel: () => void
}

export default function EditAnalysis({
  analysisId,
  initialContent,
  onSave,
  onCancel
}: EditAnalysisProps) {
  const { token } = useAuth()
  const [editedAnalysis, setEditedAnalysis] = useState(initialContent)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!token) return

    setIsSaving(true)
    try {
      const result = await analysesApi.updateAnalysis(token, analysisId, editedAnalysis)
      if (result.success) {
        onSave()
      } else {
        alert('Failed to save changes: ' + result.error)
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Edit Analysis Results
        </label>
        <textarea
          value={editedAnalysis}
          onChange={(e) => setEditedAnalysis(e.target.value)}
          className="w-full h-96 p-4 border border-gray-300 rounded-md font-mono text-sm resize-vertical"
          placeholder="Enter the analysis results..."
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white text-sm rounded-md transition-colors duration-200 flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </>
          )}
        </button>
        <button
          onClick={onCancel}
          disabled={isSaving}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white text-sm rounded-md transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
