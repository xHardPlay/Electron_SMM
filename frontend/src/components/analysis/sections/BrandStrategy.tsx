import type { BrandProfile } from '../../../utils/analysisParser'
import SectionCard from '../SectionCard'

interface BrandStrategyProps {
  brandProfile: BrandProfile
  isEditing?: boolean
  onChange?: (field: string, value: any) => void
}

export default function BrandStrategy({ brandProfile, isEditing = false, onChange }: BrandStrategyProps) {
  return (
    <SectionCard
      title="Brand Strategy"
      description="Growth drivers and strategic positioning"
      icon={
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      }
      gradientFrom="from-green-600"
      gradientTo="to-green-700"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {brandProfile.brand_strategy?.most_popular_products_services && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h4 className="font-bold text-green-900">Popular Products & Services</h4>
              </div>
              {isEditing ? (
                <textarea
                  value={brandProfile.brand_strategy.most_popular_products_services}
                  onChange={(e) => onChange?.('brand_strategy.most_popular_products_services', e.target.value)}
                  className="w-full p-2 border border-green-300 rounded-md text-green-800 bg-white"
                  rows={3}
                  placeholder="Enter popular products & services..."
                />
              ) : (
                <p className="text-green-800 leading-relaxed text-sm">{brandProfile.brand_strategy.most_popular_products_services}</p>
              )}
            </div>
          )}

          {brandProfile.brand_strategy?.top_revenue_drivers && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="font-bold text-blue-900">Top Revenue Drivers</h4>
              </div>
              {isEditing ? (
                <textarea
                  value={brandProfile.brand_strategy.top_revenue_drivers}
                  onChange={(e) => onChange?.('brand_strategy.top_revenue_drivers', e.target.value)}
                  className="w-full p-2 border border-blue-300 rounded-md text-blue-800 bg-white"
                  rows={3}
                  placeholder="Enter top revenue drivers..."
                />
              ) : (
                <p className="text-blue-800 leading-relaxed text-sm">{brandProfile.brand_strategy.top_revenue_drivers}</p>
              )}
            </div>
          )}

          {brandProfile.brand_strategy?.emerging_growth_areas && (
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h4 className="font-bold text-purple-900">Emerging Growth Areas</h4>
              </div>
              {isEditing ? (
                <textarea
                  value={brandProfile.brand_strategy.emerging_growth_areas}
                  onChange={(e) => onChange?.('brand_strategy.emerging_growth_areas', e.target.value)}
                  className="w-full p-2 border border-purple-300 rounded-md text-purple-800 bg-white"
                  rows={3}
                  placeholder="Enter emerging growth areas..."
                />
              ) : (
                <p className="text-purple-800 leading-relaxed text-sm">{brandProfile.brand_strategy.emerging_growth_areas}</p>
              )}
            </div>
          )}

          {brandProfile.brand_strategy?.why_customers_choose && (
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h4 className="font-bold text-orange-900">Why Customers Choose</h4>
              </div>
              {isEditing ? (
                <textarea
                  value={brandProfile.brand_strategy.why_customers_choose}
                  onChange={(e) => onChange?.('brand_strategy.why_customers_choose', e.target.value)}
                  className="w-full p-2 border border-orange-300 rounded-md text-orange-800 bg-white"
                  rows={3}
                  placeholder="Enter why customers choose..."
                />
              ) : (
                <p className="text-orange-800 leading-relaxed text-sm">{brandProfile.brand_strategy.why_customers_choose}</p>
              )}
            </div>
          )}
        </div>

        {brandProfile.brand_strategy?.primary_value_drivers && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11V9a2 2 0 00-2-2H7a2 2 0 00-2 2v2m6 0V9a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6m6 4v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <h4 className="font-bold text-indigo-900">Primary Value Drivers</h4>
            </div>
            {isEditing ? (
              <textarea
                value={brandProfile.brand_strategy.primary_value_drivers}
                onChange={(e) => onChange?.('brand_strategy.primary_value_drivers', e.target.value)}
                className="w-full p-2 border border-indigo-300 rounded-md text-indigo-800 bg-white"
                rows={3}
                placeholder="Enter primary value drivers..."
              />
            ) : (
              <p className="text-indigo-800 leading-relaxed">{brandProfile.brand_strategy.primary_value_drivers}</p>
            )}
          </div>
        )}
      </div>
    </SectionCard>
  )
}
