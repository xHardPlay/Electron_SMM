'use client'

import { useState } from 'react'

interface PublishControlsProps {
  onPublish: (schedule: 'now' | string) => void
  loading: boolean
}

export function PublishControls({ onPublish, loading }: PublishControlsProps) {
  const [scheduleType, setScheduleType] = useState<'now' | 'later'>('now')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')

  const handlePublish = () => {
    if (scheduleType === 'now') {
      onPublish('now')
    } else {
      const datetime = `${scheduleDate}T${scheduleTime}:00`
      onPublish(datetime)
    }
  }

  const isValidSchedule = scheduleType === 'now' ||
    (scheduleDate && scheduleTime && new Date(`${scheduleDate}T${scheduleTime}`) > new Date())

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">🚀 Publicar Campaña</h2>

      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <label className="block text-lg font-medium text-gray-300 mb-4">
            📅 Opciones de Publicación
          </label>
          <div className="space-y-4">
            <label className="flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 bg-white/5 hover:bg-indigo-500/20 border-white/20 hover:border-indigo-400/50">
              <input
                type="radio"
                name="schedule"
                value="now"
                checked={scheduleType === 'now'}
                onChange={(e) => setScheduleType(e.target.value as 'now')}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 mr-4 transition-all duration-300 ${
                scheduleType === 'now'
                  ? 'border-indigo-400 bg-indigo-400'
                  : 'border-gray-400'
              }`}>
                {scheduleType === 'now' && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
              <div>
                <span className="text-white font-medium">Publicar Ahora</span>
                <p className="text-gray-400 text-sm">La campaña se publicará inmediatamente</p>
              </div>
            </label>

            <label className="flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 bg-white/5 hover:bg-indigo-500/20 border-white/20 hover:border-indigo-400/50">
              <input
                type="radio"
                name="schedule"
                value="later"
                checked={scheduleType === 'later'}
                onChange={(e) => setScheduleType(e.target.value as 'later')}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 mr-4 transition-all duration-300 ${
                scheduleType === 'later'
                  ? 'border-indigo-400 bg-indigo-400'
                  : 'border-gray-400'
              }`}>
                {scheduleType === 'later' && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
              <div>
                <span className="text-white font-medium">Programar para Después</span>
                <p className="text-gray-400 text-sm">Elige fecha y hora para publicar</p>
              </div>
            </label>
          </div>
        </div>

        {scheduleType === 'later' && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-medium text-white mb-4">📆 Configurar Programación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  📅 Fecha
                </label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent backdrop-blur-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  🕐 Hora
                </label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent backdrop-blur-sm"
                  required
                />
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-6 border border-indigo-400/30">
          <h3 className="text-lg font-medium text-indigo-300 mb-3">📋 Resumen de Publicación</h3>
          <div className="flex items-start">
            <div className="text-2xl mr-3">ℹ️</div>
            <p className="text-indigo-200 leading-relaxed">
              {scheduleType === 'now'
                ? '🎯 La campaña se publicará inmediatamente en todas las plataformas seleccionadas.'
                : `⏰ La campaña se programará para el ${scheduleDate} a las ${scheduleTime}.`
              }
            </p>
          </div>
        </div>

        <button
          onClick={handlePublish}
          disabled={loading || !isValidSchedule}
          className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold py-5 px-8 rounded-2xl text-xl shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all duration-300 overflow-hidden group"
        >
          <span className="relative z-10">
            {loading ? '📤 Publicando...' : scheduleType === 'now' ? '🚀 Publicar Ahora' : '⏰ Programar Campaña'}
          </span>
          {!loading && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          )}
        </button>
      </div>
    </div>
  )
}
