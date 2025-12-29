'use client'

import * as mammoth from 'mammoth'
import { useState } from 'react'

interface ProcessedFile {
  file: File
  content: string
  preview: string
  wordCount: number
  error?: string
}

interface FileProcessorProps {
  onFilesProcessed: (files: ProcessedFile[]) => void
  maxFiles?: number
  maxFileSize?: number // in MB
}

export default function FileProcessor({
  onFilesProcessed,
  maxFiles = 5,
  maxFileSize = 10
}: FileProcessorProps) {
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const extractTextFromFile = async (file: File): Promise<string> => {
    const fileExtension = file.name.toLowerCase().split('.').pop()

    switch (fileExtension) {
      case 'txt':
      case 'md':
        return await readTextFile(file)

      case 'pdf':
        return await extractTextFromPDF(file)

      case 'docx':
        return await extractTextFromDOCX(file)

      default:
        throw new Error(`Unsupported file type: ${fileExtension}`)
    }
  }

  const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        resolve(text)
      }
      reader.onerror = () => reject(new Error('Failed to read text file'))
      reader.readAsText(file)
    })
  }

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer
          const uint8Array = new Uint8Array(arrayBuffer)

          // Dynamically import pdfjs-dist to avoid SSR issues
          const pdfjsLib = (await import('pdfjs-dist')).default

          // Initialize PDF.js worker
          pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

          // Load the PDF document
          const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise
          let fullText = `[PDF Content Extracted from ${file.name}]\n\n`

          // Extract text from all pages
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum)
            const textContent = await page.getTextContent()
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(' ')

            if (pageText.trim()) {
              fullText += `Page ${pageNum}:\n${pageText}\n\n`
            }
          }

          resolve(fullText)
        } catch (error) {
          console.error('PDF extraction error:', error)
          reject(new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`))
        }
      }
      reader.onerror = () => reject(new Error('Failed to read PDF file'))
      reader.readAsArrayBuffer(file)
    })
  }

  const extractTextFromDOCX = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer

          // Use mammoth.js to extract text from DOCX
          const result = await mammoth.extractRawText({ arrayBuffer })
          const text = result.value

          const fullText = `[DOCX Content Extracted from ${file.name}]\n\n${text}`

          resolve(fullText)
        } catch (error) {
          console.error('DOCX extraction error:', error)
          reject(new Error(`Failed to extract text from DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`))
        }
      }
      reader.onerror = () => reject(new Error('Failed to read DOCX file'))
      reader.readAsArrayBuffer(file)
    })
  }

  const createPreview = (content: string, maxLength: number = 500): string => {
    if (content.length <= maxLength) return content

    const truncated = content.substring(0, maxLength)
    const lastSpaceIndex = truncated.lastIndexOf(' ')
    return lastSpaceIndex > 0
      ? truncated.substring(0, lastSpaceIndex) + '...'
      : truncated + '...'
  }

  const processFiles = async (files: FileList) => {
    if (files.length + processedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    setIsProcessing(true)
    const newProcessedFiles: ProcessedFile[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        newProcessedFiles.push({
          file,
          content: '',
          preview: '',
          wordCount: 0,
          error: `File too large (max ${maxFileSize}MB)`
        })
        continue
      }

      try {
        console.log(`Processing file: ${file.name}`)
        const content = await extractTextFromFile(file)
        const preview = createPreview(content)
        const wordCount = content.split(/\s+/).filter(word => word.length > 0).length

        newProcessedFiles.push({
          file,
          content,
          preview,
          wordCount
        })

        console.log(`Successfully processed ${file.name}: ${wordCount} words`)
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error)
        newProcessedFiles.push({
          file,
          content: '',
          preview: '',
          wordCount: 0,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    const updatedFiles = [...processedFiles, ...newProcessedFiles]
    setProcessedFiles(updatedFiles)
    onFilesProcessed(updatedFiles)
    setIsProcessing(false)
  }

  const removeFile = (index: number) => {
    const updatedFiles = processedFiles.filter((_, i) => i !== index)
    setProcessedFiles(updatedFiles)
    onFilesProcessed(updatedFiles)
  }

  const clearAll = () => {
    setProcessedFiles([])
    onFilesProcessed([])
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Upload Documents
        </label>
        <input
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.md"
          onChange={(e) => e.target.files && processFiles(e.target.files)}
          disabled={isProcessing}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
        />
        <p className="text-xs text-gray-500 mt-1">
          Supported formats: PDF, DOCX, TXT, MD (max {maxFileSize}MB each, max {maxFiles} files)
        </p>
      </div>

      {isProcessing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <div>
              <p className="text-blue-800 font-medium">Processing Files...</p>
              <p className="text-blue-600 text-sm">Extracting text content from your documents</p>
            </div>
          </div>
        </div>
      )}

      {processedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Processed Files ({processedFiles.length})</h4>
            <button
              onClick={clearAll}
              className="text-xs text-red-600 hover:text-red-700 underline"
            >
              Clear All
            </button>
          </div>

          {processedFiles.map((processedFile, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{processedFile.file.name}</span>
                    <span className="text-xs text-gray-500">
                      ({(processedFile.file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  {processedFile.error ? (
                    <p className="text-xs text-red-600">{processedFile.error}</p>
                  ) : (
                    <p className="text-xs text-green-600">
                      ✓ Processed: {processedFile.wordCount} words extracted
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-600 hover:text-red-700 ml-2"
                  title="Remove file"
                >
                  ✕
                </button>
              </div>

              {!processedFile.error && (
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-xs text-gray-600 mb-1">Content Preview:</p>
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {processedFile.preview}
                  </p>
                  {processedFile.content.length > 500 && (
                    <p className="text-xs text-gray-500 mt-1">
                      ... ({processedFile.content.length - 500} more characters)
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}

          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-green-800">
                {processedFiles.filter(f => !f.error).length} files processed successfully.
                Text content will be used for AI analysis without storing files on the server.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
