import { CampaignRequest, CampaignResponse, PublishRequest } from '@/types/campaign'

export class N8nService {
  private static async makeRequest(endpoint: string, data: any): Promise<any> {
    const response = await fetch(`/api/campaign/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    return response.json()
  }

  static async createCampaign(request: CampaignRequest): Promise<CampaignResponse> {
    return this.makeRequest('create', request)
  }

  static async publishCampaign(request: PublishRequest): Promise<{ success: boolean }> {
    return this.makeRequest('publish', request)
  }
}
