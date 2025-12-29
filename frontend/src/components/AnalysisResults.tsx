'use client'

interface AnalysisResultsProps {
  analyses: any[]
}

export default function AnalysisResults({ analyses }: AnalysisResultsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
      {analyses.length === 0 ? (
        <p className="text-gray-600">No analyses yet. Start your first analysis above!</p>
      ) : (
        <div className="space-y-4">
          {analyses.map((analysis) => (
            <div key={analysis.id} className="border border-gray-200 rounded-md p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-medium">
                  {analysis.analysis_type === 'file' ? analysis.file_name : analysis.url}
                </h4>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    analysis.analysis_type === 'file' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {analysis.analysis_type === 'file' ? 'Document' : 'Website'}
                  </span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    analysis.status === 'completed' ? 'bg-green-100 text-green-800' :
                    analysis.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {analysis.status}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Created: {new Date(analysis.created_at).toLocaleDateString()}
              </p>
              {analysis.ai_analysis && (
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm">{analysis.ai_analysis}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
