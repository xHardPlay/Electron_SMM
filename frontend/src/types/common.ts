export interface Workspace {
  id: number
  name: string
  created_at: string
}

export interface Analysis {
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

export interface Character {
  id: number
  name: string
  description: string
  personality?: string
  status: 'pending' | 'approved' | 'discarded'
  workspace_id: number
  created_at: string
}

export interface Ad {
  id: number
  topic: string
  character_name: string
  ad_type: string
  content: string
  content_category?: string
  image_prompt?: string
  created_at: string
}

export interface CharacterImage {
  id: number
  file_name: string
  file_type: string
  file_data: string
  file_size: number
  character_id?: number
  workspace_id: number
  created_at: string
}

export type TabType = 'discovery' | 'voice' | 'adform' | 'analysis' | 'characters' | 'ads' | 'images'
