import type { BrandProfile } from '../../../utils/analysisParser'
import SectionCard from '../SectionCard'

interface OperationsInsightsProps {
  brandProfile: BrandProfile
  isEditing?: boolean
  onChange?: (field: string, value: any) => void
}

export default function OperationsInsights({ brandProfile, isEditing = false, onChange }: OperationsInsightsProps) {
  const hasContent = brandProfile.products_services ||
                    brandProfile.areas_served ||
                    brandProfile.additional_notes ||
                    (brandProfile.brand_contacts && brandProfile.brand_contacts.length > 0)

  if (!hasContent) return null

  return (
    <SectionCard
      title="Operations & Insights"
      description="Products, services, and additional recommendations"
      icon={
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      }
      gradientFrom="from-gray-600"
      gradientTo="to-gray-700"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {brandProfile.products_services && (
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4 border border-cyan-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h4 className="font-bold text-cyan-900">Products & Services</h4>
              </div>
              {isEditing ? (
                <textarea
                  value={brandProfile.products_services}
                  onChange={(e) => onChange?.('products_services', e.target.value)}
                  className="w-full p-2 border border-cyan-300 rounded-md text-cyan-800 bg-white"
                  rows={3}
                  placeholder="Enter products & services..."
                />
              ) : (
                <p className="text-cyan-800 leading-relaxed text-sm">{brandProfile.products_services}</p>
              )}
            </div>
          )}

          {brandProfile.areas_served && (
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4 border border-teal-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-teal-900">Areas Served</h4>
              </div>
              {isEditing ? (
                <textarea
                  value={brandProfile.areas_served}
                  onChange={(e) => onChange?.('areas_served', e.target.value)}
                  className="w-full p-2 border border-teal-300 rounded-md text-teal-800 bg-white"
                  rows={3}
                  placeholder="Enter areas served..."
                />
              ) : (
                <p className="text-teal-800 leading-relaxed text-sm">{brandProfile.areas_served}</p>
              )}
            </div>
          )}
        </div>

        {brandProfile.additional_notes && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h4 className="font-bold text-amber-900">Additional Notes & Recommendations</h4>
            </div>
            {isEditing ? (
              <textarea
                value={brandProfile.additional_notes}
                onChange={(e) => onChange?.('additional_notes', e.target.value)}
                className="w-full p-2 border border-amber-300 rounded-md text-amber-800 bg-white"
                rows={4}
                placeholder="Enter additional notes & recommendations..."
              />
            ) : (
              <p className="text-amber-800 leading-relaxed">{brandProfile.additional_notes}</p>
            )}
          </div>
        )}

        {/* Brand Contacts Section */}
        {brandProfile.brand_contacts && brandProfile.brand_contacts.length > 0 && (
          <>
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Key Contacts</h4>
              {isEditing ? (
                <div className="space-y-4">
                  {brandProfile.brand_contacts.map((contact: any, index: number) => (
                    <div key={index} className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-lg p-4 border border-cyan-200">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={contact.name || ''}
                              onChange={(e) => {
                                const newContacts = [...brandProfile.brand_contacts]
                                newContacts[index] = { ...newContacts[index], name: e.target.value }
                                onChange?.('brand_contacts', newContacts)
                              }}
                              className="w-full p-2 border border-cyan-300 rounded-md text-cyan-800 bg-white text-sm"
                              placeholder="Contact name..."
                            />
                            <input
                              type="text"
                              value={contact.role || ''}
                              onChange={(e) => {
                                const newContacts = [...brandProfile.brand_contacts]
                                newContacts[index] = { ...newContacts[index], role: e.target.value }
                                onChange?.('brand_contacts', newContacts)
                              }}
                              className="w-full p-2 border border-cyan-300 rounded-md text-cyan-800 bg-white text-sm"
                              placeholder="Contact role..."
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <input
                              type="email"
                              value={contact.email || ''}
                              onChange={(e) => {
                                const newContacts = [...brandProfile.brand_contacts]
                                newContacts[index] = { ...newContacts[index], email: e.target.value }
                                onChange?.('brand_contacts', newContacts)
                              }}
                              className="w-full p-2 border border-cyan-300 rounded-md text-cyan-800 bg-white text-sm"
                              placeholder="Email..."
                            />
                            <input
                              type="tel"
                              value={contact.phone || ''}
                              onChange={(e) => {
                                const newContacts = [...brandProfile.brand_contacts]
                                newContacts[index] = { ...newContacts[index], phone: e.target.value }
                                onChange?.('brand_contacts', newContacts)
                              }}
                              className="w-full p-2 border border-cyan-300 rounded-md text-cyan-800 bg-white text-sm"
                              placeholder="Phone..."
                            />
                            <input
                              type="url"
                              value={contact.website || ''}
                              onChange={(e) => {
                                const newContacts = [...brandProfile.brand_contacts]
                                newContacts[index] = { ...newContacts[index], website: e.target.value }
                                onChange?.('brand_contacts', newContacts)
                              }}
                              className="w-full p-2 border border-cyan-300 rounded-md text-cyan-800 bg-white text-sm"
                              placeholder="Website..."
                            />
                          </div>
                          <button
                            onClick={() => {
                              const newContacts = brandProfile.brand_contacts.filter((_, i) => i !== index)
                              onChange?.('brand_contacts', newContacts)
                            }}
                            className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded"
                            title="Remove contact"
                          >
                            × Remove Contact
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newContacts = [...brandProfile.brand_contacts, { name: '', role: '', email: '', phone: '', website: '' }]
                      onChange?.('brand_contacts', newContacts)
                    }}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded"
                  >
                    + Add Contact
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {brandProfile.brand_contacts.map((contact: any, index: number) => (
                    <div key={index} className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-lg p-4 border border-cyan-200">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-cyan-900 text-sm">{contact.name || 'N/A'}</h4>
                          <p className="text-cyan-700 text-xs mb-2">{contact.role || 'N/A'}</p>

                          <div className="space-y-1">
                            {contact.email && (
                              <div className="flex items-center gap-2">
                                <svg className="w-3 h-3 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <a href={`mailto:${contact.email}`} className="text-cyan-700 hover:text-cyan-900 text-xs truncate">
                                  {contact.email}
                                </a>
                              </div>
                            )}

                            {contact.phone && (
                              <div className="flex items-center gap-2">
                                <svg className="w-3 h-3 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <a href={`tel:${contact.phone}`} className="text-cyan-700 hover:text-cyan-900 text-xs">
                                  {contact.phone}
                                </a>
                              </div>
                            )}

                            {contact.website && (
                              <div className="flex items-center gap-2">
                                <svg className="w-3 h-3 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                <a href={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="text-cyan-700 hover:text-cyan-900 text-xs truncate">
                                  {contact.website}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </SectionCard>
  )
}
