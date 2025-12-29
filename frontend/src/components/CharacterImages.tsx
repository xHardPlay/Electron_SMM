'use client'

interface CharacterImagesProps {
  characterImages: any[]
}

export default function CharacterImages({ characterImages }: CharacterImagesProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold mb-4">Character Images</h3>
      {characterImages.length === 0 ? (
        <p className="text-gray-600">No images uploaded yet. Upload images above!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {characterImages.map((image) => (
            <div key={image.id} className="border border-gray-200 rounded-md p-4">
              <div className="mb-2">
                <img
                  src={`data:${image.file_type};base64,${image.file_data}`}
                  alt={image.file_name}
                  className="w-full h-32 object-cover rounded-md"
                />
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-medium truncate">{image.file_name}</p>
                <p className="text-xs">{(image.file_size / 1024).toFixed(1)} KB</p>
                <p className="text-xs">
                  {image.character_id ? `Character ID: ${image.character_id}` : 'Unassigned'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
