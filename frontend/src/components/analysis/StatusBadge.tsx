
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
