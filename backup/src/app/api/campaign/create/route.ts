import { NextRequest, NextResponse } from 'next/server'

const N8N_BASE_URL = process.env.NEXT_PUBLIC_N8N_BASE_URL || 'http://localhost:5678/webhook'
const WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET || 'your-secret-token'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const n8nUrl = `${N8N_BASE_URL}/create-campaing`

    const response = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WEBHOOK_SECRET}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('N8N error response:', errorText)
      throw new Error(`N8N request failed: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Campaign creation error:', error)
    return NextResponse.json(
      {
        error: 'Failed to create campaign',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
