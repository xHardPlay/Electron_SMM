'use client'

import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { analysesApi } from '../services/api/analyses'
import { BrandProfile, parseAnalysisJSON } from '../utils/analysisParser'
import EditAnalysis from './analysis/EditAnalysis'
import BrandIdentity from './analysis/sections/BrandIdentity'
import BrandStrategy from './analysis/sections/BrandStrategy'
import BrandVoiceGuide from './analysis/sections/BrandVoiceGuide'
import OperationsInsights from './analysis/sections/OperationsInsights'
import SocialMediaStrategy from './analysis/sections/SocialMediaStrategy'
import SourceTags from './analysis/SourceTags'
import StatusBadge from './analysis/StatusBadge'

interface Analysis {
  id: number
  name: string
  analysis_type: string
  urls: string[]
  file_names: string[]
  ai_analysis: string
  structured_data?: any
  status: string
  created_at: string
}

interface AnalysisResultCardProps {
  analysis: Analysis
  onDelete: (analysisId: string) => Promise<void>
  onUpdate?: () => void
}

export default function AnalysisResultCard({ analysis, onDelete, onUpdate }: AnalysisResultCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isInlineEditing, setIsInlineEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<BrandProfile | null>(null)

  const { token } = useAuth()

  const handleSave = () => {
    setIsEditing(false)
    onUpdate?.()
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleInlineEdit = () => {
    if (!brandProfile) return
    setEditedProfile(JSON.parse(JSON.stringify(brandProfile))) // Deep copy
    setIsInlineEditing(true)
  }

  const handleSaveInlineEdits = async () => {
    if (!token || !editedProfile) return

    try {
      // Convert the edited profile back to JSON string for the API
      const updatedAnalysis = JSON.stringify({ brand_profile: editedProfile })

      console.log('Saving edited analysis:', {
        analysisId: analysis.id,
        updatedAnalysis: updatedAnalysis.substring(0, 200) + '...',
        token: token.substring(0, 20) + '...'
      })

      const result = await analysesApi.updateAnalysis(token, analysis.id.toString(), updatedAnalysis)
      console.log('Save result:', result)

      if (result.success) {
        setIsInlineEditing(false)
        setEditedProfile(null)
        onUpdate?.()
        alert('Changes saved successfully!')
      } else {
        console.error('Save failed:', result.error)
        alert('Failed to save changes: ' + result.error)
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save changes: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleCancelInlineEdits = () => {
    setIsInlineEditing(false)
    setEditedProfile(null)
  }

  const handleDownload = () => {
    if (!brandProfile) return

    const dataStr = JSON.stringify({
      analysis_name: analysis.name,
      analysis_type: analysis.analysis_type,
      created_at: analysis.created_at,
      sources: {
        urls: analysis.urls,
        files: analysis.file_names
      },
      brand_profile: brandProfile
    }, null, 2)

    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

    const exportFileDefaultName = `${analysis.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_analysis.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const brandProfile = analysis.ai_analysis ? parseAnalysisJSON(analysis.ai_analysis) : null

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{analysis.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                analysis.analysis_type === 'brand'
                  ? 'bg-blue-100 text-blue-800'
                  : analysis.analysis_type === 'product'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {analysis.analysis_type === 'brand' ? '🏷️ Brand' :
                 analysis.analysis_type === 'product' ? '📦 Product' : '📄 Analysis'}
              </span>
              <StatusBadge status={analysis.status} />
            </div>
          </div>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            {brandProfile && !isInlineEditing && (
              <>
                <button
                  onClick={handleInlineEdit}
                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-md transition-colors duration-200 flex items-center gap-1"
                  title="Edit individual fields"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Fields
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded-md transition-colors duration-200 flex items-center gap-1"
                  title="Download analysis as JSON file"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download
                </button>
              </>
            )}
            {isInlineEditing && (
              <>
                <button
                  onClick={handleSaveInlineEdits}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md transition-colors duration-200 flex items-center gap-1"
                  title="Save field edits"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Edits
                </button>
                <button
                  onClick={handleCancelInlineEdits}
                  className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded-md transition-colors duration-200 flex items-center gap-1"
                  title="Cancel field edits"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              </>
            )}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md transition-colors duration-200 flex items-center gap-1"
              title="Edit raw analysis data"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {isEditing ? 'Cancel Raw Edit' : 'Edit Raw'}
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete the analysis "${analysis.name}"? This action cannot be undone.`)) {
                  onDelete(analysis.id.toString());
                }
              }}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md transition-colors duration-200 flex items-center gap-1"
              title="Delete this analysis"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              {new Date(analysis.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(analysis.created_at).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Sources */}
      {(analysis.urls.length > 0 || analysis.file_names.length > 0) && (
        <div className="mb-4 p-3 bg-white/60 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Analysis Sources
          </h4>
          <SourceTags urls={analysis.urls} fileNames={analysis.file_names} />
        </div>
      )}

      {/* Analysis Content */}
      {analysis.ai_analysis && analysis.status === 'completed' ? (
        <div className="space-y-8">
          {brandProfile ? (
            <>
              {/* Executive Summary - Key Highlights */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Brand Analysis Complete</h3>
                    <p className="text-blue-100">Comprehensive brand intelligence for {brandProfile.brand_name || analysis.name}</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">{brandProfile.brand_identity?.competitive_landscape?.length || 0}</div>
                    <div className="text-sm text-blue-100">Competitors Identified</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">{brandProfile.brand_voice_guide?.words_to_use?.length || 0}</div>
                    <div className="text-sm text-blue-100">Brand Words</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">4</div>
                    <div className="text-sm text-blue-100">Content Pillars</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-sm text-blue-100">Complete Analysis</div>
                  </div>
                </div>
              </div>

              {/* Analysis Sections */}
              {isEditing ? (
                <EditAnalysis
                  analysisId={analysis.id.toString()}
                  initialContent={analysis.ai_analysis || ''}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              ) : (
                <>
                  <BrandIdentity
                    brandProfile={isInlineEditing ? editedProfile : brandProfile}
                    isEditing={isInlineEditing}
                    onChange={(field, value) => {
                      if (editedProfile) {
                        const newProfile = { ...editedProfile }
                        const keys = field.split('.')
                        let current: any = newProfile
                        for (let i = 0; i < keys.length - 1; i++) {
                          if (!current[keys[i]]) current[keys[i]] = {}
                          current = current[keys[i]]
                        }
                        current[keys[keys.length - 1]] = value
                        setEditedProfile(newProfile)
                      }
                    }}
                  />
              <BrandStrategy
                brandProfile={isInlineEditing ? editedProfile : brandProfile}
                isEditing={isInlineEditing}
                onChange={(field, value) => {
                  if (editedProfile) {
                    const newProfile = { ...editedProfile }
                    const keys = field.split('.')
                    let current: any = newProfile
                    for (let i = 0; i < keys.length - 1; i++) {
                      if (!current[keys[i]]) current[keys[i]] = {}
                      current = current[keys[i]]
                    }
                    current[keys[keys.length - 1]] = value
                    setEditedProfile(newProfile)
                  }
                }}
              />
              <BrandVoiceGuide
                brandProfile={isInlineEditing ? editedProfile : brandProfile}
                isEditing={isInlineEditing}
                onChange={(field, value) => {
                  if (editedProfile) {
                    const newProfile = { ...editedProfile }
                    const keys = field.split('.')
                    let current: any = newProfile
                    for (let i = 0; i < keys.length - 1; i++) {
                      if (!current[keys[i]]) current[keys[i]] = {}
                      current = current[keys[i]]
                    }
                    current[keys[keys.length - 1]] = value
                    setEditedProfile(newProfile)
                  }
                }}
              />
                  <SocialMediaStrategy brandProfile={isInlineEditing ? editedProfile : brandProfile} />
                  <OperationsInsights
                    brandProfile={isInlineEditing ? editedProfile : brandProfile}
                    isEditing={isInlineEditing}
                    onChange={(field, value) => {
                      if (editedProfile) {
                        const newProfile = { ...editedProfile }
                        const keys = field.split('.')
                        let current: any = newProfile
                        for (let i = 0; i < keys.length - 1; i++) {
                          if (!current[keys[i]]) current[keys[i]] = {}
                          current = current[keys[i]]
                        }
                        current[keys[keys.length - 1]] = value
                        setEditedProfile(newProfile)
                      }
                    }}
                  />
                </>
              )}
            </>
          ) : (
            /* Fallback: Display Raw AI Response when JSON parsing fails */
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Analysis Results</h3>
                  <p className="text-orange-100">Raw AI response (JSON parsing failed - showing complete analysis)</p>
                </div>
              </div>
            </div>
          )}

          {/* Show structured content if JSON parsed successfully, otherwise show raw response */}
          {brandProfile ? (
            <>
            </>
          ) : (
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-orange-800">JSON Parsing Failed</p>
                    <p className="text-xs text-orange-700">The AI response appears to be malformed. Check browser console for full debug info.</p>
                    <p className="text-xs text-orange-600 mt-1">
                      Response length: {analysis.ai_analysis?.length || 0} characters
                    </p>
                  </div>
                </div>
              </div>
              <details className="mb-4">
                <summary className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">
                  Show Full Raw Response (Debug Info)
                </summary>
                <div className="mt-2 text-gray-700 leading-relaxed whitespace-pre-wrap text-xs max-h-96 overflow-y-auto border border-gray-200 rounded-md p-4 bg-gray-50 font-mono">
                  {analysis.ai_analysis}
                </div>
              </details>
              {isEditing ? (
                <EditAnalysis
                  analysisId={analysis.id.toString()}
                  initialContent={analysis.ai_analysis || ''}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              ) : (
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm max-h-96 overflow-y-auto border border-gray-200 rounded-md p-4 bg-gray-50">
                  <p className="text-sm text-gray-600 mb-2 italic">Last 500 characters (where error likely occurred):</p>
                  {analysis.ai_analysis?.substring(Math.max(0, (analysis.ai_analysis.length || 0) - 500)) || 'No response'}
                </div>
              )}
            </div>
          )}
        </div>
      ) : analysis.status === 'processing' ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
            <div>
              <p className="text-yellow-800 font-medium">Analysis in Progress</p>
              <p className="text-yellow-600 text-sm">AI is processing your content. This may take a few minutes...</p>
            </div>
          </div>
        </div>
      ) : analysis.status === 'analyzing_content' ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <div>
              <p className="text-blue-800 font-medium">📊 Analyzing Content</p>
              <p className="text-blue-600 text-sm">Extracting and processing content from your sources...</p>
            </div>
          </div>
        </div>
      ) : analysis.status === 'processing_ai' ? (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-pulse">
              <div className="w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
            </div>
            <div>
              <p className="text-purple-800 font-medium">🤖 AI Processing</p>
              <p className="text-purple-600 text-sm">AI is analyzing your content and generating insights...</p>
            </div>
          </div>
        </div>
      ) : analysis.status === 'parsing_results' ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
            <div>
              <p className="text-green-800 font-medium">🔧 Parsing Results</p>
              <p className="text-green-600 text-sm">Validating and structuring the analysis results...</p>
            </div>
          </div>
        </div>
      ) : analysis.status === 'finalizing' ? (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
            <div>
              <p className="text-indigo-800 font-medium">✨ Finalizing Analysis</p>
              <p className="text-indigo-600 text-sm">Putting the finishing touches on your comprehensive analysis...</p>
            </div>
          </div>
        </div>
      ) : analysis.status === 'failed' ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-red-800 font-medium">Analysis Failed</p>
              <p className="text-red-600 text-sm">There was an error processing your analysis. Please try again.</p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Structured Data Summary */}
      {analysis.structured_data && (
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Key Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.structured_data.key_insights?.map((insight: string, index: number) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-purple-600">✓</span>
                </div>
                <p className="text-sm text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
          {analysis.structured_data.target_audience && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-1">Target Audience:</p>
              <p className="text-sm text-blue-800">{analysis.structured_data.target_audience}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
