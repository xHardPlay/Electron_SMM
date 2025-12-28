'use client'

import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { CampaignRequest, Tone, Goal, Platform } from '@/types/campaign'

interface CampaignFormProps {
  onSubmit: (data: CampaignRequest) => void
  loading: boolean
}

export function CampaignForm({ onSubmit, loading }: CampaignFormProps) {
  const [formData, setFormData] = useState<CampaignRequest>({
    brand: '',
    product: '',
    platforms: [],
    tone: 'professional',
    goal: 'sales',
    visual_style: '',
    cta: '',
    description: '',
    sources: [],
  })

  const [draggedFiles, setDraggedFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const submitButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const button = submitButtonRef.current
    if (!button) return

    const ctx = gsap.context(() => {
      // Idle breathing animation
      if (!loading) {
        gsap.to(button, {
          scale: 1.02,
          duration: 2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          paused: false
        })
      }

      // Hover effects
      const handleMouseEnter = () => {
        if (loading) return

        gsap.to(button, {
          scale: 1.08,
          y: -3,
          duration: 0.4,
          ease: "back.out(1.7)",
          boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.5)"
        })

        // Add glow effect
        gsap.to(button.querySelector('.button-text'), {
          textShadow: "0 0 20px rgba(255, 255, 255, 0.8)",
          duration: 0.3
        })
      }

      const handleMouseLeave = () => {
        if (loading) return

        gsap.to(button, {
          scale: 1.02, // Keep slight breathing
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
        })

        gsap.to(button.querySelector('.button-text'), {
          textShadow: "none",
          duration: 0.3
        })
      }

      // Loading animation
      if (loading) {
        gsap.killTweensOf(button) // Stop other animations

        // Pulsing loading effect
        gsap.to(button, {
          scale: 0.98,
          duration: 0.6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true
        })

        // Rotate the emoji in the loading text
        const emoji = button.querySelector('.loading-emoji')
        if (emoji) {
          gsap.to(emoji, {
            rotation: 360,
            duration: 1,
            ease: "none",
            repeat: -1
          })
        }
      }

      button.addEventListener('mouseenter', handleMouseEnter)
      button.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        button.removeEventListener('mouseenter', handleMouseEnter)
        button.removeEventListener('mouseleave', handleMouseLeave)
        gsap.killTweensOf(button)
      }
    })

    return () => ctx.revert()
  }, [loading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handlePlatformChange = (platform: Platform, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      platforms: checked
        ? [...prev.platforms, platform]
        : prev.platforms.filter(p => p !== platform)
    }))
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Configurar Campaña</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nombre de Marca
            </label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              placeholder="Ej: Coca-Cola, Nike..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Producto/Servicio
            </label>
            <input
              type="text"
              value={formData.product}
              onChange={(e) => setFormData(prev => ({ ...prev, product: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              placeholder="Ej: Zapatillas deportivas, Servicio de consultoría..."
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tono
            </label>
            <select
              value={formData.tone}
              onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value as Tone }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            >
              <option value="professional" className="bg-slate-800">Profesional</option>
              <option value="casual" className="bg-slate-800">Casual</option>
              <option value="aggressive" className="bg-slate-800">Agresivo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Objetivo
            </label>
            <select
              value={formData.goal}
              onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value as Goal }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            >
              <option value="sales" className="bg-slate-800">Ventas</option>
              <option value="traffic" className="bg-slate-800">Tráfico</option>
              <option value="branding" className="bg-slate-800">Branding</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Llamado a la Acción
            </label>
            <input
              type="text"
              value={formData.cta}
              onChange={(e) => setFormData(prev => ({ ...prev, cta: e.target.value }))}
              placeholder="Ej: ¡Compra ahora!, ¡Aprende más!..."
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Estilo Visual
          </label>
          <input
            type="text"
            value={formData.visual_style}
            onChange={(e) => setFormData(prev => ({ ...prev, visual_style: e.target.value }))}
            placeholder="Ej: minimalista, vibrante, corporativo, moderno..."
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-4">
            Plataformas de Publicación
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: 'instagram' as Platform, label: 'Instagram', icon: '📸' },
              { key: 'facebook' as Platform, label: 'Facebook', icon: '👥' },
              { key: 'youtube' as Platform, label: 'YouTube', icon: '🎥' }
            ].map(platform => (
              <label key={platform.key} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                formData.platforms.includes(platform.key)
                  ? 'border-indigo-400 bg-indigo-500/20 text-white'
                  : 'border-white/20 bg-white/5 text-gray-300'
              }`}>
                <input
                  type="checkbox"
                  checked={formData.platforms.includes(platform.key)}
                  onChange={(e) => handlePlatformChange(platform.key, e.target.checked)}
                  className="sr-only"
                />
                <span className="text-2xl mr-3">{platform.icon}</span>
                <span className="font-medium">{platform.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Descripción Adicional (Opcional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe tu marca, producto o cualquier contexto adicional que quieras que considere la IA para generar contenido más personalizado..."
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-4">
            Fuentes de Referencia (URLs - Opcional)
          </label>
          <div className="space-y-3">
            {formData.sources?.map((source, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="url"
                  value={source}
                  onChange={(e) => {
                    const newSources = [...(formData.sources || [])]
                    newSources[index] = e.target.value
                    setFormData(prev => ({ ...prev, sources: newSources }))
                  }}
                  placeholder="https://ejemplo.com"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newSources = (formData.sources || []).filter((_, i) => i !== index)
                    setFormData(prev => ({ ...prev, sources: newSources }))
                  }}
                  className="px-4 py-3 bg-red-500/80 hover:bg-red-500 text-white rounded-xl transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  sources: [...(prev.sources || []), '']
                }))
              }}
              className="w-full py-3 px-4 border-2 border-dashed border-white/30 text-gray-300 rounded-xl"
            >
              + Agregar Fuente (URL)
            </button>
          </div>
          {formData.sources && formData.sources.length > 0 && (
            <p className="text-sm text-indigo-300 mt-3">
              ✨ Agregaste {formData.sources.filter(s => s.trim()).length} fuente(s) de referencia
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-4">
            Archivos de Referencia (Opcional)
          </label>
          <div
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
              isDragOver
                ? 'border-indigo-400 bg-indigo-500/10 scale-105'
                : 'border-white/20 bg-white/5'
            }`}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragOver(true)
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              setIsDragOver(false)
            }}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragOver(false)

              const files = Array.from(e.dataTransfer.files)
              setDraggedFiles(prev => [...prev, ...files])

              console.log('Files dropped:', files)
            }}
          >
            <div className="space-y-4">
              <div className="text-5xl text-gray-400">
                📁
              </div>
              <div>
                <p className="text-gray-300 text-lg">
                  Arrastra y suelta archivos aquí, o{' '}
                  <label className="text-indigo-400 cursor-pointer underline font-medium">
                    selecciona archivos
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || [])
                        setDraggedFiles(prev => [...prev, ...files])
                        console.log('Files selected:', files)
                      }}
                    />
                  </label>
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Soporta imágenes, documentos, PDFs y más
                </p>
              </div>

              {draggedFiles.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-300 mb-3">
                    📎 Archivos seleccionados ({draggedFiles.length}):
                  </p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {draggedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/10 px-4 py-3 rounded-xl text-sm">
                        <span className="text-white truncate max-w-xs">{file.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setDraggedFiles(prev => prev.filter((_, i) => i !== index))
                            }}
                            className="text-red-400 hover:text-red-300 text-lg"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setDraggedFiles([])}
                    className="mt-3 text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    🗑️ Limpiar todos los archivos
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          ref={submitButtonRef}
          type="submit"
          disabled={loading || formData.platforms.length === 0}
          className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all duration-300 overflow-hidden group"
        >
          <span className="relative z-10 button-text">
            {loading ? (
              <>
                <span className="loading-emoji">🚀</span> Generando Campaña...
              </>
            ) : (
              '🎯 Generar Campaña con IA'
            )}
          </span>
          {!loading && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          )}
        </button>
      </form>
    </div>
  )
}
