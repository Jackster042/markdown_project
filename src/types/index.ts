/**
 * Options for downloading markdown files
 */
export interface DownloadOptions {
  /** The filename for the downloaded file (without extension) */
  filename: string
  /** The markdown content to download */
  content: string
}

/**
 * Response from the text-to-markdown conversion
 */
export interface ConversionResponse {
  /** The converted markdown content */
  markdown: string
  /** Whether the conversion was successful */
  success: boolean
  /** Optional error message if conversion failed */
  error?: string
}

/**
 * Input for the conversion mutation
 */
export interface ConversionInput {
  /** The raw text to convert to markdown */
  text: string
}
