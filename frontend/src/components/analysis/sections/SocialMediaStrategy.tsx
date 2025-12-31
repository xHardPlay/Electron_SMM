import type { BrandProfile } from '../../../utils/analysisParser'
import SectionCard from '../SectionCard'

interface SocialMediaStrategyProps {
  brandProfile: BrandProfile
}

export default function SocialMediaStrategy({ brandProfile }: SocialMediaStrategyProps) {
  if (!brandProfile.social_media_content_mix) return null

  const { social_media_content_mix } = brandProfile

  return (
    <SectionCard
      title="Social Media Strategy"
      description="Content pillars and distribution strategy"
      icon={
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V1m10 3V1m0 3l1 1v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5l1-1z" />
        </svg>
      }
      gradientFrom="from-pink-600"
      gradientTo="to-rose-600"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-3">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray={`${parseInt((social_media_content_mix?.value_education || '0 percent').replace(' percent', '')) * 1.1}, 110`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-blue-600">{social_media_content_mix.value_education}</span>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900">Value & Education</h4>
            <p className="text-sm text-gray-600">Educational content</p>
          </div>

          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-3">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray={`${parseInt((social_media_content_mix?.connection_story || '0 percent').replace(' percent', '')) * 1.1}, 110`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-green-600">{social_media_content_mix.connection_story}</span>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900">Connection & Story</h4>
            <p className="text-sm text-gray-600">Relationship content</p>
          </div>

          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-3">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="3"
                  strokeDasharray={`${parseInt((social_media_content_mix?.proof_authority || '0 percent').replace(' percent', '')) * 1.1}, 110`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-purple-600">{social_media_content_mix.proof_authority}</span>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900">Proof & Authority</h4>
            <p className="text-sm text-gray-600">Credibility content</p>
          </div>

          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-3">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeDasharray={`${parseInt((social_media_content_mix?.direct_promotion || '0 percent').replace(' percent', '')) * 1.1}, 110`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-orange-600">{social_media_content_mix.direct_promotion}</span>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900">Direct Promotion</h4>
            <p className="text-sm text-gray-600">Sales content</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-2">Content Strategy Summary</h4>
          <p className="text-gray-700 text-sm">
            Your social media content should be distributed as:
            <strong> {social_media_content_mix.value_education}</strong> educational value,
            <strong> {social_media_content_mix.connection_story}</strong> relationship building,
            <strong> {social_media_content_mix.proof_authority}</strong> credibility and expertise, and
            <strong> {social_media_content_mix.direct_promotion}</strong> promotional content.
          </p>
        </div>
      </div>
    </SectionCard>
  )
}
