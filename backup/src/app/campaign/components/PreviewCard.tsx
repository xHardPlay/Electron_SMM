'use client'

import { useState } from 'react'
import { CampaignResponse } from '@/types/campaign'

interface PreviewCardProps {
  data: CampaignResponse
  onEdit: (field: 'short' | 'long', value: string) => void
  onApprove: () => void
  onRegenerate: () => void
}

export function PreviewCard({ data, onEdit, onApprove, onRegenerate }: PreviewCardProps) {
  const [editing, setEditing] = useState<'short' | 'long' | 'post' | null>(null)
  const [editValues, setEditValues] = useState({
    short: data.copy?.short || '',
    long: data.copy?.long || '',
    post: data.post || '',
  })

  const handleSave = (field: 'short' | 'long' | 'post') => {
    if (field === 'post') {
      // For new format, just trigger regenerate for now
      onRegenerate()
    } else {
      onEdit(field, editValues[field])
    }
    setEditing(null)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
      console.log('Texto copiado al portapapeles')
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }

  // Check if we're using the new n8n response format
  const isNewFormat = data.post && data.imgprompt

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Vista Previa de Campaña</h2>

      <div className="space-y-6">
        {/* Content Section */}
        <div>
          <h3 className="text-xl font-bold text-white mb-6 text-center">✨ Contenido Generado por IA</h3>

          {isNewFormat ? (
            /* New n8n format */
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  📝 Post Generado
                </label>
                <div className="relative">
                  <p className="p-4 bg-white/10 backdrop-blur-sm rounded-lg text-white leading-relaxed pr-32">{data.post}</p>
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button
                      onClick={() => copyToClipboard(data.post || '')}
                      className="px-3 py-1 bg-green-500/80 hover:bg-green-500 text-white text-xs rounded-lg transition-colors duration-200 backdrop-blur-sm"
                      title="Copiar al portapapeles"
                    >
                      📋 Copiar
                    </button>
                    <button
                      onClick={() => setEditing('post')}
                      className="px-3 py-1 bg-indigo-500/80 hover:bg-indigo-500 text-white text-xs rounded-lg transition-colors duration-200 backdrop-blur-sm"
                      title="Editar texto"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onRegenerate()} // Regenerate both but we'll handle in parent
                      className="px-3 py-1 bg-yellow-500/80 hover:bg-yellow-500 text-white text-xs rounded-lg transition-colors duration-200 backdrop-blur-sm"
                      title="Regenerar post"
                    >
                      🔄 Post
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  🎨 Prompt para Imagen
                </label>
                <div className="relative">
                  <p className="p-4 bg-white/10 backdrop-blur-sm rounded-lg text-gray-300 text-sm leading-relaxed pr-32">{data.imgprompt}</p>
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button
                      onClick={() => copyToClipboard(data.imgprompt || '')}
                      className="px-3 py-1 bg-green-500/80 hover:bg-green-500 text-white text-xs rounded-lg transition-colors duration-200 backdrop-blur-sm"
                      title="Copiar prompt al portapapeles"
                    >
                      📋 Copiar
                    </button>
                    <button
                      onClick={() => onRegenerate()} // Regenerate both but we'll handle in parent
                      className="px-3 py-1 bg-yellow-500/80 hover:bg-yellow-500 text-white text-xs rounded-lg transition-colors duration-200 backdrop-blur-sm"
                      title="Regenerar prompt de imagen"
                    >
                      🔄 Prompt
                    </button>
                  </div>
                </div>
              </div>

              {data.brandVoice && (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    🗣️ Voz de Marca
                  </label>
                  <div className="relative">
                    <p className="p-4 bg-white/10 backdrop-blur-sm rounded-lg text-white leading-relaxed pr-32">{data.brandVoice}</p>
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <button
                        onClick={() => copyToClipboard(data.brandVoice || '')}
                        className="px-3 py-1 bg-green-500/80 hover:bg-green-500 text-white text-xs rounded-lg transition-colors duration-200 backdrop-blur-sm"
                        title="Copiar voz de marca al portapapeles"
                      >
                        📋 Copiar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Old format with copy and assets */
            <div className="space-y-6">
              {data.copy && (
                <>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      📄 Copy Corto
                    </label>
                    {editing === 'short' ? (
                      <div className="space-y-3">
                        <textarea
                          value={editValues.short}
                          onChange={(e) => setEditValues(prev => ({ ...prev, short: e.target.value }))}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent backdrop-blur-sm resize-none"
                          rows={3}
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleSave('short')}
                            className="px-6 py-2 bg-green-500/80 hover:bg-green-500 text-white rounded-lg transition-colors duration-200 backdrop-blur-sm"
                          >
                            💾 Guardar
                          </button>
                          <button
                            onClick={() => setEditing(null)}
                            className="px-6 py-2 bg-gray-500/80 hover:bg-gray-500 text-white rounded-lg transition-colors duration-200 backdrop-blur-sm"
                          >
                            ❌ Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start gap-4">
                        <p className="flex-1 p-4 bg-white/10 backdrop-blur-sm rounded-lg text-white leading-relaxed">{data.copy.short}</p>
                        <button
                          onClick={() => setEditing('short')}
                          className="px-4 py-2 bg-indigo-500/80 hover:bg-indigo-500 text-white rounded-lg transition-colors duration-200 backdrop-blur-sm whitespace-nowrap"
                        >
                          ✏️ Editar
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      📖 Copy Largo
                    </label>
                    {editing === 'long' ? (
                      <div className="space-y-3">
                        <textarea
                          value={editValues.long}
                          onChange={(e) => setEditValues(prev => ({ ...prev, long: e.target.value }))}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent backdrop-blur-sm resize-none"
                          rows={5}
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleSave('long')}
                            className="px-6 py-2 bg-green-500/80 hover:bg-green-500 text-white rounded-lg transition-colors duration-200 backdrop-blur-sm"
                          >
                            💾 Guardar
                          </button>
                          <button
                            onClick={() => setEditing(null)}
                            className="px-6 py-2 bg-gray-500/80 hover:bg-gray-500 text-white rounded-lg transition-colors duration-200 backdrop-blur-sm"
                          >
                            ❌ Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start gap-4">
                        <p className="flex-1 p-4 bg-white/10 backdrop-blur-sm rounded-lg text-white leading-relaxed">{data.copy.long}</p>
                        <button
                          onClick={() => setEditing('long')}
                          className="px-4 py-2 bg-indigo-500/80 hover:bg-indigo-500 text-white rounded-lg transition-colors duration-200 backdrop-blur-sm whitespace-nowrap"
                        >
                          ✏️ Editar
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* AI Tools Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h4 className="text-lg font-semibold text-white mb-4 text-center">🛠️ Herramientas de IA Recomendadas</h4>
          <p className="text-gray-300 text-sm text-center mb-4">
            Mejora tus prompts y genera mejores imágenes con estas herramientas
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'Gemini', url: 'https://gemini.google.com', color: 'from-blue-500 to-cyan-500', icon: '🔷' },
              { name: 'ChatGPT', url: 'https://chat.openai.com', color: 'from-green-500 to-emerald-500', icon: '🤖' },
              { name: 'Meta.ai', url: 'https://meta.ai', color: 'from-blue-600 to-indigo-600', icon: '📘' },
              { name: 'Recraft.ai', url: 'https://recraft.ai', color: 'from-purple-500 to-pink-500', icon: '🎨' }
            ].map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`bg-gradient-to-r ${tool.color} text-white text-center py-3 px-2 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-xs font-medium`}
                title={`Abrir ${tool.name} en nueva pestaña`}
              >
                <div className="text-lg mb-1">{tool.icon}</div>
                <div className="font-bold">{tool.name}</div>
              </a>
            ))}
          </div>
        </div>

        {/* Assets Section - Only show for old format */}
        {data.assets && data.assets.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Assets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.assets.map((asset, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                    {asset.type === 'image' ? (
                      <img
                        src={asset.url}
                        alt={`Asset ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <div className="text-gray-500">Video Preview</div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 capitalize">{asset.type}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={onApprove}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-105"
          >
            ✅ Aprobar y Continuar
          </button>
          <button
            onClick={onRegenerate}
            className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 hover:scale-105"
          >
            🔄 Regenerar Campaña
          </button>
        </div>
      </div>
    </div>
  )
}
