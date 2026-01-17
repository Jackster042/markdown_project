import type { DownloadOptions } from '../types'

export function downloadMarkdown({ filename, content }: DownloadOptions): void {
  // Create Blob with markdown MIME type
  const blob = new Blob([content], { type: 'text/markdown' })
  
  // Create temporary URL
  const url = URL.createObjectURL(blob)
  
  // Create and trigger download
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.md`
  document.body.appendChild(link)
  link.click()
  
  // Cleanup to prevent memory leaks
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
