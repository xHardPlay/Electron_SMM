export type Tone = 'professional' | 'casual' | 'aggressive'
export type Goal = 'traffic' | 'sales' | 'branding'
export type Platform = 'instagram' | 'facebook' | 'youtube'
export type Format = '1:1' | '4:5' | '16:9'

export interface CampaignRequest {
  brand: string
  product: string
  platforms: Platform[]
  tone: Tone
  goal: Goal
  visual_style: string
  cta: string
  description?: string
  sources?: string[]
  files?: FileList
}

export interface CampaignResponse {
  copy?: {
    short: string
    long: string
  }
  assets?: Array<{
    type: 'image' | 'video'
    url: string
  }>
  campaign_id?: string
  // New n8n response format
  post?: string
  imgprompt?: string
  brandVoice?: string
}

export interface PublishRequest {
  campaign_id: string
  schedule: 'now' | string // ISO datetime string
}

export interface CampaignState {
  status: 'idle' | 'loading' | 'success' | 'error'
  data: CampaignResponse | null
  error: string | null
}

export interface ComfyUIRequest {
  prompt: string
  style: string
  format: Format
}

export interface ComfyUIResponse {
  image_url: string
}
