import { useMutation } from '@tanstack/react-query'
import type { ConversionInput, ConversionResponse } from '../types'

async function convertText(input: ConversionInput): Promise<ConversionResponse> {
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
  
  return {
    markdown,
    success: true,
  }
}

export function useConvertText() {
  return useMutation({
    mutationFn: convertText,
  })
}
