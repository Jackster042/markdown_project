import { useMutation } from '@tanstack/react-query'
import type { ConversionInput, ConversionResponse } from '../types'

// Simple hash function for cache keys
function hashText(text: string): string {
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return hash.toString(36)
}

// Cache expiry time (1 hour)
const CACHE_TTL = 1000 * 60 * 60

interface CacheEntry {
  response: ConversionResponse
  timestamp: number
}

// In-memory cache with TTL (persists during session)
const cacheWithTTL = new Map<string, CacheEntry>()

function getCachedResponse(text: string): ConversionResponse | null {
  const hash = hashText(text)
  const entry = cacheWithTTL.get(hash)
  
  if (!entry) return null
  
  // Check if cache is still valid
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cacheWithTTL.delete(hash)
    return null
  }
  
  return entry.response
}

function setCachedResponse(text: string, response: ConversionResponse): void {
  const hash = hashText(text)
  cacheWithTTL.set(hash, {
    response,
    timestamp: Date.now(),
  })
}

async function convertText(input: ConversionInput): Promise<ConversionResponse> {
  // Check cache first
  const cached = getCachedResponse(input.text)
  if (cached) {
    console.log('[Cache] Hit - returning cached conversion')
    return cached
  }
  
  console.log('[Cache] Miss - performing conversion')
  
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Mock conversion: wrap text in basic markdown structure
  // This is where a real AI API call would go
  const lines = input.text.trim().split('\n')
  const title = lines[0].slice(0, 50) || 'Converted Document'
  const body = lines.slice(1).join('\n').trim()
  
  const markdown = `# ${title}

${body || input.text}
`
  
  const response: ConversionResponse = {
    markdown,
    success: true,
  }
  
  // Cache the response
  setCachedResponse(input.text, response)
  
  return response
}

export function useConvertText() {
  return useMutation({
    mutationFn: convertText,
  })
}
