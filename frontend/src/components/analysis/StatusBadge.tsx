
interface StatusBadgeProps {
  status: string
  className?: string
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          label: '✅ Complete',
          classes: 'bg-green-100 text-green-800'
        }
      case 'analyzing_content':
        return {
          label: '📊 Analyzing',
          classes: 'bg-blue-100 text-blue-800'
        }
      case 'processing_ai':
        return {
          label: '🤖 AI Processing',
          classes: 'bg-purple-100 text-purple-800'
        }
      case 'parsing_results':
        return {
          label: '🔧 Parsing',
          classes: 'bg-green-100 text-green-800'
        }
      case 'finalizing':
        return {
          label: '✨ Finalizing',
          classes: 'bg-indigo-100 text-indigo-800'
        }
      case 'processing':
        return {
          label: '⚡ Processing',
          classes: 'bg-yellow-100 text-yellow-800'
        }
      case 'generating':
        return {
          label: '🎨 Generating',
          classes: 'bg-orange-100 text-orange-800'
        }
      case 'preparing_brand_context':
        return {
          label: '📋 Preparing Context',
          classes: 'bg-cyan-100 text-cyan-800'
        }
      case 'analyzing_brand_data':
        return {
          label: '🔍 Analyzing Data',
          classes: 'bg-teal-100 text-teal-800'
        }
      case 'planning_content_mix':
        return {
          label: '📝 Planning Mix',
          classes: 'bg-lime-100 text-lime-800'
        }
      case 'generating_content':
        return {
          label: '✍️ Creating Content',
          classes: 'bg-amber-100 text-amber-800'
        }
      case 'approved':
        return {
          label: '👍 Approved',
          classes: 'bg-emerald-100 text-emerald-800'
        }
      case 'discarded':
        return {
          label: '👎 Discarded',
          classes: 'bg-gray-100 text-gray-800'
        }
      case 'pending':
        return {
          label: '⏳ Pending',
          classes: 'bg-stone-100 text-stone-800'
        }
      default:
        return {
          label: '❌ Failed',
          classes: 'bg-red-100 text-red-800'
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.classes} ${className}`}>
      {config.label}
    </span>
  )
}
