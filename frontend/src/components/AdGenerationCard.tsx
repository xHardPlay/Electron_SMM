'use client'

interface AdGeneration {
  id: number
  workspace_id: number
  ad_type: string
  topic: string
  quantity: number
  content_mix?: { education: number; story: number; proof: number; promotion: number }
  status: string
  created_at: string
  updated_at: string
}

interface AdGenerationCardProps {
  generation: AdGeneration
}

export default function AdGenerationCard({ generation }: AdGenerationCardProps) {
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'processing':
        return {
          text: 'Processing',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          icon: '⏳',
          description: 'Starting ad generation...'
        }
      case 'preparing_brand_context':
        return {
          text: 'Preparing Brand Context',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          icon: '🔍',
          description: 'Gathering brand analysis data...'
        }
      case 'analyzing_brand_data':
        return {
          text: 'Analyzing Brand Data',
          bgColor: 'bg-indigo-50',
          borderColor: 'border-indigo-200',
          textColor: 'text-indigo-800',
          icon: '📊',
          description: 'Processing brand information for context...'
        }
      case 'planning_content_mix':
        return {
          text: 'Planning Content Mix',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          textColor: 'text-purple-800',
          icon: '🎯',
          description: 'Planning content distribution strategy...'
        }
      case 'generating_content':
        return {
          text: 'Generating Ads',
          bgColor: 'bg-pink-50',
          borderColor: 'border-pink-200',
          textColor: 'text-pink-800',
          icon: '✍️',
          description: 'Creating AI-powered ad content...'
        }
      case 'completed':
        return {
          text: 'Ads Generated',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          icon: '✅',
          description: 'Ad generation completed successfully!'
        }
      case 'failed':
        return {
          text: 'Generation Failed',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          icon: '❌',
          description: 'There was an error generating ads.'
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
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
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
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.textColor} border ${statusInfo.borderColor}`}>
          {generation.ad_type.replace('_', ' ')}
        </div>
      </div>

      <div className="mb-4">
        <h4 className={`text-lg font-semibold ${statusInfo.textColor} mb-1`}>
          "{generation.topic}"
        </h4>
        <p className={`text-sm ${statusInfo.textColor} opacity-75`}>
          {generation.quantity} ad{generation.quantity !== 1 ? 's' : ''} requested
        </p>
      </div>

      {generation.content_mix && (
        <div className="mb-4 p-3 bg-white bg-opacity-50 rounded-lg">
          <h5 className={`text-sm font-medium ${statusInfo.textColor} mb-2`}>
            Content Mix:
          </h5>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span>Education:</span>
              <span className="font-medium">{generation.content_mix.education}%</span>
            </div>
            <div className="flex justify-between">
              <span>Story:</span>
              <span className="font-medium">{generation.content_mix.story}%</span>
            </div>
            <div className="flex justify-between">
              <span>Proof:</span>
              <span className="font-medium">{generation.content_mix.proof}%</span>
            </div>
            <div className="flex justify-between">
              <span>Promotion:</span>
              <span className="font-medium">{generation.content_mix.promotion}%</span>
            </div>
          </div>
        </div>
      )}

      {generation.status !== 'completed' && generation.status !== 'failed' && (
        <div className="flex items-center gap-3 mb-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current opacity-75"></div>
          <span className={`text-sm ${statusInfo.textColor} opacity-75`}>
            Processing...
          </span>
        </div>
      )}

      <div className="pt-4 border-t border-current border-opacity-20">
        <div className="flex justify-between items-center text-xs text-current opacity-60">
          <span>
            Started: {new Date(generation.created_at).toLocaleString()}
          </span>
          {generation.status !== 'processing' && generation.status !== 'preparing_brand_context' &&
           generation.status !== 'analyzing_brand_data' && generation.status !== 'planning_content_mix' &&
           generation.status !== 'generating_content' && (
            <span>
              Updated: {new Date(generation.updated_at).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
