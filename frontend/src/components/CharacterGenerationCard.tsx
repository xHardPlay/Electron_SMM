'use client'

interface CharacterGeneration {
  id: number
  workspace_id: number
  analysis_id?: number
  status: string
  created_at: string
  updated_at: string
}

interface CharacterGenerationCardProps {
  generation: CharacterGeneration
}

export default function CharacterGenerationCard({ generation }: CharacterGenerationCardProps) {
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'processing':
        return {
          text: 'Processing',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          icon: '⏳',
          description: 'Starting character generation...'
        }
      case 'analyzing_brand_context':
        return {
          text: 'Analyzing Brand Context',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          icon: '🔍',
          description: 'Analyzing brand analysis data...'
        }
      case 'generating_characters':
        return {
          text: 'Generating Characters',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          textColor: 'text-purple-800',
          icon: '🎭',
          description: 'Creating AI characters based on brand analysis...'
        }
      case 'finalizing':
        return {
          text: 'Finalizing Characters',
          bgColor: 'bg-indigo-50',
          borderColor: 'border-indigo-200',
          textColor: 'text-indigo-800',
          icon: '✨',
          description: 'Putting the finishing touches on your characters...'
        }
      case 'completed':
        return {
          text: 'Characters Generated',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          icon: '✅',
          description: 'Character generation completed successfully!'
        }
      case 'failed':
        return {
          text: 'Generation Failed',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          icon: '❌',
          description: 'There was an error generating characters.'
        }
      default:
        return {
          text: status,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          icon: '❓',
          description: 'Unknown status'
        }
    }
  }

  const statusInfo = getStatusDisplay(generation.status)

  return (
    <div className={`${statusInfo.bgColor} border ${statusInfo.borderColor} rounded-xl p-6 shadow-sm`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-2xl">{statusInfo.icon}</div>
        <div>
          <h3 className={`text-xl font-bold ${statusInfo.textColor}`}>
            {statusInfo.text}
          </h3>
          <p className={`text-sm ${statusInfo.textColor} opacity-75`}>
            {statusInfo.description}
          </p>
        </div>
      </div>

      {generation.status !== 'completed' && generation.status !== 'failed' && (
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current opacity-75"></div>
          <span className={`text-sm ${statusInfo.textColor} opacity-75`}>
            Processing...
          </span>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-current border-opacity-20">
        <div className="flex justify-between items-center text-xs text-current opacity-60">
          <span>
            Started: {new Date(generation.created_at).toLocaleString()}
          </span>
          {generation.status !== 'processing' && generation.status !== 'analyzing_brand_context' &&
           generation.status !== 'generating_characters' && generation.status !== 'finalizing' && (
            <span>
              Updated: {new Date(generation.updated_at).toLocaleString()}
            </span>
          )}
        </div>
        {generation.analysis_id && (
          <div className="mt-2 text-xs text-current opacity-60">
            Based on Brand Analysis #{generation.analysis_id}
          </div>
        )}
      </div>
    </div>
  )
}
