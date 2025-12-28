import { NextRequest, NextResponse } from 'next/server'

const N8N_BASE_URL = process.env.NEXT_PUBLIC_N8N_BASE_URL || 'http://localhost:5678/webhook-test'
const WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET || 'your-secret-token'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received publish request:', body)

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock response simulating successful publishing
    const mockResponse = {
      success: true,
      campaign_id: body.campaign_id,
      published_at: new Date().toISOString(),
      platforms: ['facebook', 'instagram'], // Mock successful publishing
      message: body.schedule === 'now' ? 'Campaign published successfully!' : `Campaign scheduled for ${body.schedule}`
    }

    console.log('Mock publish response:', mockResponse)
    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error('Campaign publish error:', error)
    return NextResponse.json(
      { error: 'Failed to publish campaign' },
      { status: 500 }
    )
  }
}
