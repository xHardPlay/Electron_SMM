import { useState } from 'react'
import FileProcessor from './FileProcessor'

interface Workspace {
  id: number
  name: string
  created_at: string
}

interface AnalysisFormProps {
  workspaces: Workspace[]
  selectedWorkspace: string
  onWorkspaceSelect: (workspaceId: string) => void
  onStartAnalysis: (
    workspaceId: string,
    analysisType: 'brand' | 'product',
    name: string,
    urls: string[],
    processedFiles: any[]
  ) => Promise<void>
  loading: boolean
}

export default function AnalysisForm({
  workspaces,
  selectedWorkspace,
  onWorkspaceSelect,
  onStartAnalysis,
  loading,
}: AnalysisFormProps) {
  const [analysisType, setAnalysisType] = useState<'brand' | 'product'>('brand')
  const [brandName, setBrandName] = useState('')
  const [productName, setProductName] = useState('')
  const [analysisUrls, setAnalysisUrls] = useState<string[]>([''])
  const [processedFiles, setProcessedFiles] = useState<any[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const name = analysisType === 'brand' ? brandName : productName
    if (!name.trim()) return

    const hasValidUrls = analysisUrls.some(url => url.trim() !== '')
    const hasValidFiles = processedFiles.some(file => !file.error && file.content && file.content.trim() !== '')

    if (!hasValidUrls && !hasValidFiles) {
      alert('Please add at least one URL or upload a file')
      return
    }

    onStartAnalysis(selectedWorkspace, analysisType, name, analysisUrls.filter(url => url.trim()), processedFiles)

    // Reset form
    setBrandName('')
    setProductName('')
    setAnalysisUrls([''])
    setProcessedFiles([])
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold mb-4">Brand & Product Discovery</h3>
      <p className="text-sm text-gray-600 mb-6">
        Upload documents, add website links, and let AI analyze your brand or product comprehensively.
        Information will be stored and can be edited for future use.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="workspaceSelect" className="block text-sm font-medium mb-1">
            Select Workspace
          </label>
          <select
            id="workspaceSelect"
            value={selectedWorkspace}
            onChange={(e) => onWorkspaceSelect(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Choose a workspace...</option>
            {workspaces.map((workspace) => (
              <option key={workspace.id} value={workspace.id.toString()}>
                {workspace.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">
            Analysis Type
          </label>
          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="radio"
                value="brand"
                checked={analysisType === 'brand'}
                onChange={(e) => setAnalysisType(e.target.value as 'brand' | 'product')}
                className="mr-2"
              />
              <div>
                <span className="font-medium">Brand Analysis</span>
                <p className="text-xs text-gray-500">Analyze brand identity, values, target audience</p>
              </div>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="product"
                checked={analysisType === 'product'}
                onChange={(e) => setAnalysisType(e.target.value as 'brand' | 'product')}
                className="mr-2"
              />
              <div>
                <span className="font-medium">Product Analysis</span>
                <p className="text-xs text-gray-500">Analyze product features, benefits, positioning</p>
              </div>
            </label>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor={analysisType === 'brand' ? 'brandName' : 'productName'} className="block text-sm font-medium mb-1">
            {analysisType === 'brand' ? 'Brand Name' : 'Product Name'}
          </label>
          <input
            type="text"
            id={analysisType === 'brand' ? 'brandName' : 'productName'}
            value={analysisType === 'brand' ? brandName : productName}
            onChange={(e) => analysisType === 'brand' ? setBrandName(e.target.value) : setProductName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder={analysisType === 'brand' ? 'Enter brand name' : 'Enter product name'}
          />
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium">
              Website Links
            </label>
            <button
              type="button"
              onClick={() => setAnalysisUrls([...analysisUrls, ''])}
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              + Add Link
            </button>
          </div>
          {analysisUrls.map((url, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  const newUrls = [...analysisUrls]
                  newUrls[index] = e.target.value
                  setAnalysisUrls(newUrls)
                }}
                placeholder="https://example.com"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => setAnalysisUrls(analysisUrls.filter((_, i) => i !== index))}
                className="px-3 py-2 text-red-600 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))}
          {analysisUrls.length === 0 && (
            <p className="text-sm text-gray-500 italic">No links added yet</p>
          )}
        </div>

        <FileProcessor
          onFilesProcessed={setProcessedFiles}
          maxFiles={5}
          maxFileSize={10}
        />

        <button
          type="submit"
          disabled={loading || !selectedWorkspace || (!brandName && !productName)}
          className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : `Analyze ${analysisType === 'brand' ? 'Brand' : 'Product'}`}
        </button>
      </form>
    </div>
  )
}
