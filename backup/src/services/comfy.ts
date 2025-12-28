import { ComfyUIRequest, ComfyUIResponse } from '@/types/campaign'

const COMFYUI_BASE_URL = process.env.COMFYUI_BASE_URL || 'http://localhost:8188'

export class ComfyUIService {
  static async generateImage(request: ComfyUIRequest): Promise<ComfyUIResponse> {
    const response = await fetch(`${COMFYUI_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`ComfyUI request failed: ${response.statusText}`)
    }

    return response.json()
  }
}
