'use client'

interface AdsDisplayProps {
  ads: any[]
}

export default function AdsDisplay({ ads }: AdsDisplayProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold mb-4">Generated Ads</h3>
      {ads.length === 0 ? (
        <p className="text-gray-600">No ads generated yet. Create ads above!</p>
      ) : (
        <div className="space-y-4">
          {ads.map((ad) => (
            <div key={ad.id} className="border border-gray-200 rounded-md p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-lg font-medium">{ad.topic}</h4>
                  <p className="text-sm text-gray-600">{ad.character_name} • {ad.ad_type.replace('_', ' ')}</p>
                </div>
                <span className="px-2 py-1 rounded text-sm bg-orange-100 text-orange-800">
                  {ad.ad_type.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Created: {new Date(ad.created_at).toLocaleDateString()}
              </p>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm whitespace-pre-wrap">{ad.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
