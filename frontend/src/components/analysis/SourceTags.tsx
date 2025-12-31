interface SourceTagsProps {
  urls: string[]
  fileNames: string[]
}

export default function SourceTags({ urls, fileNames }: SourceTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {urls.map((url, index) => (
        <span key={`url-${index}`} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {url.length > 30 ? `${url.substring(0, 30)}...` : url}
        </span>
      ))}
      {fileNames.map((fileName, index) => (
        <span key={`file-${index}`} className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {fileName}
        </span>
      ))}
    </div>
  )
}
