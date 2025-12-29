'use client'

interface BrandDiscoveryProps {
  showAnalysisForm: boolean
  setShowAnalysisForm: (show: boolean) => void
  selectedWorkspace: string
  workspaces: any[]
  analysisType: 'brand' | 'product'
  setAnalysisType: (type: 'brand' | 'product') => void
  brandName: string
  setBrandName: (name: string) => void
  productName: string
  setProductName: (name: string) => void
  analysisUrls: string[]
  setAnalysisUrls: (urls: string[]) => void
  uploadedFiles: File[]
  setUploadedFiles: (files: File[]) => void
  loading: boolean
  handleWorkspaceSelect: (workspaceId: string) => void
  handleStartAnalysis: (e: React.FormEvent) => void
}

export default function BrandDiscovery({
  showAnalysisForm,
  setShowAnalysisForm,
  selectedWorkspace,
  workspaces,
  analysisType,
  setAnalysisType,
  brandName,
  setBrandName,
  productName,
  setProductName,
  analysisUrls,
  setAnalysisUrls,
  uploadedFiles,
  setUploadedFiles,
  loading,
  handleWorkspaceSelect,
  handleStartAnalysis
}: BrandDiscoveryProps) {
  const addUrl = () => {
    setAnalysisUrls([...analysisUrls, ''])
  }

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...analysisUrls]
    newUrls[index] = value
    setAnalysisUrls(newUrls)
  }

  const removeUrl = (index: number) => {
    setAnalysisUrls(analysisUrls.filter((_, i) => i !== index))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedFiles([...uploadedFiles, ...files])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Brand Discovery</h2>
        <p className="text-gray-600 mb-4">Get comprehensive information about brands or products</p>
        <button
          onClick={() => setShowAnalysisForm(!showAnalysisForm)}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          {showAnalysisForm ? 'Cancel' : 'Start Discovery'}
        </button>
      </div>

      {showAnalysisForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4">Brand & Product Discovery</h3>
          <p className="text-sm text-gray-600 mb-6">
            Upload documents, add website links, and let AI analyze your brand or product comprehensively.
            Information will be stored and can be edited for future use.
          </p>

          <form onSubmit={handleStartAnalysis}>
            <div className="mb-6">
              <label htmlFor="workspaceSelect" className="block text-sm font-medium mb-1">
                Select Workspace
              </label>
              <select
                id="workspaceSelect"
                value={selectedWorkspace}
                onChange={(e) => handleWorkspaceSelect(e.target.value)}
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
                  onClick={addUrl}
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
                    onChange={(e) => updateUrl(index, e.target.value)}
                    placeholder="https://example.com"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeUrl(index)}
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

            <div className="mb-6">
              <label htmlFor="fileUpload" className="block text-sm font-medium mb-1">
                Upload Documents
              </label>
              <input
                type="file"
                id="fileUpload"
                multiple
                accept=".pdf,.docx,.txt,.md,.pptx,.xlsx"
                onChange={handleFileUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PDF, DOCX, TXT, MD, PPTX, XLSX (max 10MB each)
              </p>

              {uploadedFiles.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium mb-2">Uploaded Files:</p>
                  <div className="space-y-1">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                        <span className="text-sm">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-700 ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !selectedWorkspace || (!brandName && !productName) || (analysisUrls.length === 0 && uploadedFiles.length === 0)}
              className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : `Analyze ${analysisType === 'brand' ? 'Brand' : 'Product'}`}
            </button>
          </form>
        </div>
      )}
    </>
  )
}
