import { Analysis } from '../../types/common'

const API_BASE = 'https://electron-backend.carlos-mdtz9.workers.dev/api'

export const analysesApi = {
  async fetchAnalyses(token: string, workspaceId: string): Promise<Analysis[]> {
    try {
      console.log('🔍 FETCHING ANALYSES - Request Details:')
      console.log('  Workspace ID:', workspaceId)
      console.log('  URL:', `${API_BASE}/analyses?workspace_id=${workspaceId}`)
      console.log('  Headers:', { 'Authorization': `Bearer ${token.substring(0, 20)}...` })

      const startTime = Date.now()
      const response = await fetch(`${API_BASE}/analyses?workspace_id=${workspaceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const endTime = Date.now()

      console.log('📡 HTTP RESPONSE - Status Details:')
      console.log('  Status:', response.status, response.statusText)
      console.log('  Response Time:', endTime - startTime, 'ms')
      console.log('  Headers:', Object.fromEntries(response.headers.entries()))
      console.log('  Response:', response)

      if (response.ok) {
        const data = await response.json()
        console.log('✅ SUCCESS - Analysis Data:')
        console.log('  Total analyses:', data.analyses?.length || 0)
        console.log('  Analyses details:', data.analyses?.map((a: any) => ({
          id: a.id,
          name: a.name,
          status: a.status,
          analysis_type: a.analysis_type,
          ai_analysis_length: a.ai_analysis?.length || 0,
          has_structured_data: !!a.structured_data
        })) || [])

        // Log detailed AI analysis content for debugging
        if (data.analyses && data.analyses.length > 0) {
          data.analyses.forEach((analysis: any, index: number) => {
            console.log(`📄 Analysis #${index + 1} - ${analysis.name}:`)
            console.log('  Status:', analysis.status)
            console.log('  AI Analysis Length:', analysis.ai_analysis?.length || 0)
            if (analysis.ai_analysis) {
              console.log('  AI Analysis Preview (first 4000 chars):', analysis.ai_analysis.substring(0, 4000))
              if (analysis.ai_analysis.length > 4000) {
                console.log('  ... (truncated, full length:', analysis.ai_analysis.length, 'chars)')
              }
            }
            if (analysis.structured_data) {
              console.log('  Structured Data:', analysis.structured_data)
            }
          })
        }

        return data.analyses || []
      } else {
        console.error('❌ FAILED - HTTP Error Details:')
        console.error('  Status:', response.status, response.statusText)
        const errorText = await response.text()
        console.error('  Error Response Body:', errorText)
        console.error('  Full Response:', response)
        return []
      }
    } catch (error) {
      console.error('💥 NETWORK ERROR - Fetch Analyses Failed:')
      console.error('  Error:', error)
      console.error('  Error Type:', error instanceof Error ? error.constructor.name : typeof error)
      if (error instanceof Error) {
        console.error('  Stack Trace:', error.stack)
      }
      throw error
    }
  },

  async createAnalysis(
    token: string,
    workspaceId: string,
    analysisType: 'brand' | 'product',
    name: string,
    urls: string[],
    processedFiles: any[]
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const formData = new FormData()
      formData.append('workspace_id', workspaceId)
      formData.append('analysis_type', analysisType)
      formData.append('name', name)

      // Add URLs
      urls.forEach((url, index) => {
        if (url.trim()) {
          formData.append(`url_${index}`, url.trim())
        }
      })

      // Add processed file content as text
      processedFiles.forEach((processedFile, index) => {
        if (!processedFile.error) {
          formData.append(`file_content_${index}`, processedFile.content)
          formData.append(`file_name_${index}`, processedFile.file.name)
        }
      })

      const response = await fetch(`${API_BASE}/analyses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Failed to start analysis' }
      }
    } catch (error) {
      console.error('Error starting analysis:', error)
      return { success: false, error: 'Network error' }
    }
  },

  async updateAnalysis(token: string, analysisId: string, aiAnalysis: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/analyses/${analysisId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ai_analysis: aiAnalysis }),
      })

      if (response.ok) {
        return { success: true }
      } else {
        const data = await response.json()
        return { success: false, error: data.error || 'Failed to update analysis' }
      }
    } catch (error) {
      console.error('Error updating analysis:', error)
      return { success: false, error: 'Network error' }
    }
  },

  async deleteAnalysis(token: string, analysisId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/analyses/${analysisId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        return { success: true }
      } else {
        const data = await response.json()
        return { success: false, error: data.error || 'Failed to delete analysis' }
      }
    } catch (error) {
      console.error('Error deleting analysis:', error)
      return { success: false, error: 'Network error' }
    }
  },
}
