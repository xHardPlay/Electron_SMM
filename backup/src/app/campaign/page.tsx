'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { CampaignForm } from './components/CampaignForm'
import { PreviewCard } from './components/PreviewCard'
import { PublishControls } from './components/PublishControls'
import { CampaignRequest, CampaignResponse, CampaignState } from '@/types/campaign'
import { N8nService } from '@/services/n8n'
import { gsap } from 'gsap'

type Step = 'form' | 'preview' | 'publish'

export default function CampaignPage() {
  const [step, setStep] = useState<Step>('form')
  const [campaignState, setCampaignState] = useState<CampaignState>({
    status: 'idle',
    data: null,
    error: null,
  })
  const [publishLoading, setPublishLoading] = useState(false)
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(false)
  const [lastRequest, setLastRequest] = useState<CampaignRequest | null>(null)

  const handleFormSubmit = async (data: CampaignRequest) => {
    setLastRequest(data)
    setCampaignState({ status: 'loading', data: null, error: null })
    setShowLoadingAnimation(true)

    // Start the API call
    const apiCall = N8nService.createCampaign(data)

    // Show animation for at least 3 seconds
    const minAnimationTime = new Promise(resolve => setTimeout(resolve, 3000))

    try {
      const [response] = await Promise.all([apiCall, minAnimationTime])

      // Handle n8n returning array vs object
      const campaignData = Array.isArray(response) ? response[0] : response

      setCampaignState({
        status: 'success',
        data: campaignData,
        error: null,
      })
      setStep('preview')
    } catch (error) {
      console.error('Campaign creation error:', error)
      setCampaignState({
        status: 'error',
        data: null,
        error: error instanceof Error ? error.message : 'Failed to create campaign',
      })
    } finally {
      setShowLoadingAnimation(false)
    }
  }

  const handleEditCopy = (field: 'short' | 'long' | 'post', value: string) => {
    if (!campaignState.data) return

    if (field === 'post') {
      // For new format, just trigger regenerate for now
      handleRegenerate()
      return
    }

    // Handle old format editing
    setCampaignState(prev => ({
      ...prev,
      data: prev.data ? {
        ...prev.data,
        copy: prev.data.copy ? {
          ...prev.data.copy,
          [field]: value,
        } : { short: '', long: '' },
      } : null,
    }))
  }

  const handleApprove = () => {
    setStep('publish')
  }

  const handleRegenerate = async () => {
    if (!lastRequest) {
      // Fallback to going back to form if no last request
      setStep('form')
      setCampaignState({ status: 'idle', data: null, error: null })
      return
    }

    // Resend the same request
    await handleFormSubmit(lastRequest)
  }

  const handlePublish = async (schedule: 'now' | string) => {
    if (!campaignState.data) return

    setPublishLoading(true)

    try {
      await N8nService.publishCampaign({
        campaign_id: campaignState.data.campaign_id || 'unknown',
        schedule,
      })

      // Show success message or redirect
      alert(schedule === 'now' ? 'Campaign published successfully!' : 'Campaign scheduled successfully!')
    } catch (error) {
      alert('Failed to publish campaign: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setPublishLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-400/15 to-indigo-400/15 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>

      <div className="relative z-10 max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-indigo-300 hover:text-indigo-100 mb-6 transition-colors duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al Inicio
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent mb-4">
            Crear Campaña
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Genera contenido publicitario impactante con IA y automatiza tu presencia en redes sociales.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            {(['form', 'preview', 'publish'] as Step[]).map((s, index) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step === s
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 scale-110'
                      : index < ['form', 'preview', 'publish'].indexOf(step)
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : 'bg-white/10 border border-white/20 text-gray-400 backdrop-blur-sm'
                  }`}
                >
                  {index + 1}
                </div>
                <span className={`ml-4 text-lg font-medium transition-colors duration-300 ${
                  step === s ? 'text-white' : 'text-gray-400'
                }`}>
                  {s === 'form' ? 'Configurar' : s === 'preview' ? 'Vista Previa' : 'Publicar'}
                </span>
                {index < 2 && (
                  <div
                    className={`w-20 h-1 mx-6 rounded-full transition-all duration-300 ${
                      index < ['form', 'preview', 'publish'].indexOf(step)
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-white/20'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {step === 'form' && (
            <CampaignForm
              onSubmit={handleFormSubmit}
              loading={campaignState.status === 'loading'}
            />
          )}

          {step === 'preview' && campaignState.data && (
            <PreviewCard
              data={campaignState.data}
              onEdit={handleEditCopy}
              onApprove={handleApprove}
              onRegenerate={handleRegenerate}
            />
          )}

          {step === 'publish' && campaignState.data && (
            <PublishControls
              onPublish={handlePublish}
              loading={publishLoading}
            />
          )}

          {/* Error Display */}
          {campaignState.status === 'error' && (
            <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-lg rounded-2xl p-6 max-w-2xl mx-auto">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-300">
                    Error
                  </h3>
                  <p className="text-red-200 mt-1">
                    {campaignState.error}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Epic Loading Animation Overlay */}
      {showLoadingAnimation && <EpicLoadingAnimation />}
    </div>
  )
}

// Epic Loading Animation Component
function EpicLoadingAnimation() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Smiling face dot positions (forming a smiley face)
      const faceDots = [
        // Eyes
        { x: 200, y: 150, id: 'eye-left' },
        { x: 400, y: 150, id: 'eye-right' },
        // Mouth curve (simplified smile)
        { x: 150, y: 250, id: 'mouth-1' },
        { x: 180, y: 280, id: 'mouth-2' },
        { x: 220, y: 300, id: 'mouth-3' },
        { x: 260, y: 310, id: 'mouth-4' },
        { x: 300, y: 310, id: 'mouth-5' },
        { x: 340, y: 310, id: 'mouth-6' },
        { x: 380, y: 300, id: 'mouth-7' },
        { x: 420, y: 280, id: 'mouth-8' },
        { x: 450, y: 250, id: 'mouth-9' },
        // Additional connecting dots
        { x: 250, y: 200, id: 'cheek-left' },
        { x: 350, y: 200, id: 'cheek-right' },
        { x: 300, y: 220, id: 'nose' },
      ]

      // Create dots
      faceDots.forEach((dot, index) => {
        const dotElement = document.createElement('div')
        dotElement.className = 'absolute w-4 h-4 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-0'
        dotElement.style.left = `${dot.x}px`
        dotElement.style.top = `${dot.y}px`
        dotsRef.current?.appendChild(dotElement)

        // Animate dots appearing with stagger
        gsap.to(dotElement, {
          opacity: 0.8,
          scale: 1,
          duration: 0.8,
          delay: index * 0.05,
          ease: "back.out(1.7)"
        })
      })

      // Create connecting lines animation
      const createLine = (fromDot: Element, toDot: Element) => {
        const fromRect = fromDot.getBoundingClientRect()
        const toRect = toDot.getBoundingClientRect()

        const line = document.createElement('div')
        line.className = 'absolute bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0'
        line.style.width = '2px'
        line.style.height = '2px'
        line.style.left = `${fromRect.left + fromRect.width/2}px`
        line.style.top = `${fromRect.top + fromRect.height/2}px`

        overlayRef.current?.appendChild(line)

        // Animate line growth
        gsap.to(line, {
          opacity: 0.6,
          scaleX: Math.sqrt(
            Math.pow(toRect.left - fromRect.left, 2) +
            Math.pow(toRect.top - fromRect.top, 2)
          ) / 4,
          rotation: Math.atan2(toRect.top - fromRect.top, toRect.left - fromRect.left) * 180 / Math.PI,
          duration: 1,
          delay: 1.5,
          ease: "power2.out"
        })

        return line
      }

      // Connect the dots to form the smile
      setTimeout(() => {
        // Connect eyes to mouth
        const dots = dotsRef.current?.children
        if (dots) {
          // Connect left eye to mouth start
          createLine(dots[0], dots[2])
          // Connect right eye to mouth end
          createLine(dots[1], dots[10])
          // Connect mouth curve
          for (let i = 2; i < 11; i++) {
            if (dots[i] && dots[i + 1]) {
              createLine(dots[i], dots[i + 1])
            }
          }
        }
      }, 1000)

      // Pulsing animation for all dots
      gsap.to('.absolute.w-4.h-4', {
        scale: 1.2,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        stagger: 0.1,
        ease: "sine.inOut"
      })

      // Floating text animation
      const textRef = overlayRef.current?.querySelector('.loading-text')
      if (textRef) {
        gsap.fromTo(textRef, {
          y: 20,
          opacity: 0
        }, {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 2,
          ease: "power3.out"
        })

        // Continuous subtle text animation
        gsap.to(textRef, {
          y: -5,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        })
      }

    }, overlayRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Connecting Dots Container */}
        <div ref={dotsRef} className="relative w-[600px] h-[400px]">
          {/* Central face area for dots */}
        </div>

        {/* Loading Text */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-center">
          <div className="loading-text text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Generando magia con IA... ✨
          </div>
          <div className="text-gray-400 text-sm">
            Tu campaña publicitaria está tomando forma
          </div>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
