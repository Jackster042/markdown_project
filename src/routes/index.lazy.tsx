import { useState } from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'
import { FileDown, Copy, Trash2, Sparkles, Loader2, Check } from 'lucide-react'
import { useConvertText } from '../hooks/useConvertText'
import { downloadMarkdown } from '../utils/downloadMarkdown'

export const Route = createLazyFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const [inputText, setInputText] = useState('')
  const [convertedMarkdown, setConvertedMarkdown] = useState('')
  const [copied, setCopied] = useState(false)

  const mutation = useConvertText()

  const handleConvert = () => {
    if (!inputText.trim()) return
    
    mutation.mutate(
      { text: inputText },
      {
        onSuccess: (data) => {
          if (data.success) {
            setInputText(data.markdown)         // Replace input with converted text
            setConvertedMarkdown(data.markdown) // Keep for download/copy
          }
        },
      }
    )
  }

  const handleDownload = () => {
    if (!convertedMarkdown) return
    
    const timestamp = new Date().toISOString().slice(0, 10)
    downloadMarkdown({
      filename: `converted-${timestamp}`,
      content: convertedMarkdown,
    })
  }

  const handleCopy = async () => {
    if (!convertedMarkdown) return
    
    try {
      await navigator.clipboard.writeText(convertedMarkdown)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleClear = () => {
    setInputText('')
    setConvertedMarkdown('')
    mutation.reset()
  }

  const hasContent = inputText.trim().length > 0
  const hasResult = convertedMarkdown.length > 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Convert Text to Markdown
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Paste your raw text below and convert it to clean, structured Markdown.
        </p>
      </div>

      {/* Workspace Card */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        {/* Textarea Section */}
        <div className="p-6">
          <label htmlFor="text-input" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Raw Text Input
          </label>
          <textarea
            id="text-input"
            rows={12}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your text here..."
            className="w-full resize-none rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-emerald-500 dark:focus:bg-zinc-900"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              {inputText.length.toLocaleString()} characters
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              {hasResult ? 'Conversion complete' : 'Markdown output will appear after conversion'}
            </span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <button
            type="button"
            onClick={handleClear}
            disabled={!hasContent && !hasResult}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!hasResult}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleConvert}
              disabled={!hasContent || mutation.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Convert
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!hasResult}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 shadow-sm transition-all hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-500 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
            >
              <FileDown className="h-4 w-4" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Tips
        </h3>
        <ul className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
          <li>• Paste any unformatted text to convert it to Markdown</li>
          <li>• The converter will structure headings, lists, and paragraphs</li>
          <li>• Download as .md file or copy directly to clipboard</li>
        </ul>
      </div>
    </div>
  )
}
