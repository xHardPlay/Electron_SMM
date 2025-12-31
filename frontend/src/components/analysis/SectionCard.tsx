import React from 'react'

interface SectionCardProps {
  title: string
  description?: string
  icon: React.ReactNode
  gradientFrom: string
  gradientTo: string
  children: React.ReactNode
  className?: string
}

export default function SectionCard({
  title,
  description,
  icon,
  gradientFrom,
  gradientTo,
  children,
  className = ''
}: SectionCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white p-4`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold">{title}</h3>
            {description && <p className="text-current text-sm opacity-90">{description}</p>}
          </div>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}
