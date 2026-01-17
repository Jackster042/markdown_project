# MD Convert - Technical Documentation

> Internal Text-to-Markdown Conversion Tool  
> Version 1.0 | January 2026

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Quick Start](#quick-start)
3. [Architecture](#architecture)
4. [File Structure](#file-structure)
5. [Component & Hook Reference](#component--hook-reference)
6. [Type Definitions](#type-definitions)
7. [Future: AI Integration Roadmap](#future-ai-integration-roadmap)
8. [Future: Database Integration Roadmap](#future-database-integration-roadmap)
9. [Possible Improvements](#possible-improvements)

---

## Project Overview

### Purpose

MD Convert is an internal tool for converting raw, unformatted text into structured Markdown files. It's built with a **"Backend-Ready" architecture** - functioning entirely client-side for the prototype while being designed for seamless AI and database integration.

### Current Features

- Paste raw text and convert to Markdown format
- Visual feedback during conversion (loading spinner)
- Download as `.md` file with timestamp
- Copy converted Markdown to clipboard
- Dark mode support
- Responsive, professional UI

### Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Package Manager | pnpm | 10.x |
| Framework | React | 19.2.0 |
| Build Tool | Vite | 7.x |
| Language | TypeScript | 5.9.x |
| Routing | TanStack Router | 1.150.0 |
| Data Fetching | TanStack Query | 5.90.x |
| Styling | Tailwind CSS | 4.1.x |
| Icons | Lucide React | 0.562.x |

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linting
pnpm lint
```

The dev server runs at `http://localhost:5173` (or next available port).

---

## Architecture

### Design Principles

1. **Backend-Ready Pattern**: All data mutations flow through TanStack Query's `useMutation`, making it trivial to swap mock functions for real API calls.

2. **Single Responsibility**: Each utility/hook does one thing:
   - `useConvertText` - handles conversion logic
   - `downloadMarkdown` - handles file generation
   - Route components - handle UI only

3. **Type Safety**: All inputs/outputs are strictly typed in `src/types/index.ts`.

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface                           │
│                    (src/routes/index.lazy.tsx)                  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      useConvertText Hook                        │
│                   (src/hooks/useConvertText.ts)                 │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  convertText() function                                 │   │
│   │  ─────────────────────────────────────────────────────  │   │
│   │  CURRENT: Mock conversion (500ms delay)                 │   │
│   │  FUTURE:  API call to AI service                        │   │
│   └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     ConversionResponse                          │
│              { markdown: string, success: boolean }             │
└─────────────────────────────────────────────────────────────────┘
                               │
              ┌────────────────┴────────────────┐
              ▼                                 ▼
┌──────────────────────────┐      ┌──────────────────────────────┐
│     Display in UI        │      │     downloadMarkdown()       │
│   (textarea updated)     │      │  (src/utils/downloadMarkdown)│
└──────────────────────────┘      └──────────────────────────────┘
```

---

## File Structure

```
markdown_project/
├── src/
│   ├── hooks/
│   │   └── useConvertText.ts    # TanStack Query mutation hook
│   │
│   ├── routes/
│   │   ├── __root.tsx           # Global layout (Navbar, Footer)
│   │   └── index.lazy.tsx       # Main workspace page
│   │
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   │
│   ├── utils/
│   │   └── downloadMarkdown.ts  # File download utility
│   │
│   ├── index.css                # Tailwind CSS entry
│   ├── main.tsx                 # App entry with providers
│   └── routeTree.gen.ts         # Auto-generated route tree
│
├── public/                      # Static assets
├── package.json
├── vite.config.ts               # Vite + plugins config
├── tsconfig.json                # TypeScript config
├── plan.md                      # Original implementation plan
└── DOCS.md                      # This file
```

---

## Component & Hook Reference

### `useConvertText` Hook

**Location:** `src/hooks/useConvertText.ts`

A TanStack Query mutation hook that handles text-to-markdown conversion.

```typescript
import { useConvertText } from '../hooks/useConvertText'

function MyComponent() {
  const mutation = useConvertText()
  
  const handleConvert = () => {
    mutation.mutate(
      { text: 'Raw text here' },
      {
        onSuccess: (data) => {
          console.log(data.markdown) // Converted markdown
        },
        onError: (error) => {
          console.error(error)
        }
      }
    )
  }
  
  return (
    <button 
      onClick={handleConvert}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? 'Converting...' : 'Convert'}
    </button>
  )
}
```

**Returns:** TanStack Query mutation object with:
- `mutate(input)` - Trigger conversion
- `isPending` - Loading state
- `isSuccess` - Success state
- `isError` - Error state
- `data` - ConversionResponse on success
- `reset()` - Reset mutation state

---

### `downloadMarkdown` Utility

**Location:** `src/utils/downloadMarkdown.ts`

Triggers a browser download of markdown content as a `.md` file.

```typescript
import { downloadMarkdown } from '../utils/downloadMarkdown'

downloadMarkdown({
  filename: 'my-document',  // Will save as my-document.md
  content: '# Hello World\n\nThis is markdown.'
})
```

**Implementation Details:**
- Creates a Blob with `text/markdown` MIME type
- Uses `URL.createObjectURL()` for temporary download URL
- Automatically cleans up URL object to prevent memory leaks

---

### Route Components

#### `__root.tsx` - Global Layout

Provides consistent structure across all pages:
- **Navbar**: Logo, app name, version badge
- **Main Content Area**: Centered container (max-width: 5xl)
- **Footer**: Branding information

#### `index.lazy.tsx` - Workspace Page

The main conversion interface:
- Textarea with character count
- Action buttons (Clear, Copy, Convert, Download)
- Loading states and visual feedback
- Tips section

**State Management:**
- `inputText` - Raw text input (local state)
- `convertedMarkdown` - Conversion result (local state)
- `copied` - Clipboard feedback (local state)
- Mutation state from `useConvertText`

---

## Type Definitions

**Location:** `src/types/index.ts`

### ConversionInput

```typescript
interface ConversionInput {
  /** The raw text to convert to markdown */
  text: string
}
```

### ConversionResponse

```typescript
interface ConversionResponse {
  /** The converted markdown content */
  markdown: string
  /** Whether the conversion was successful */
  success: boolean
  /** Optional error message if conversion failed */
  error?: string
}
```

### DownloadOptions

```typescript
interface DownloadOptions {
  /** The filename for the downloaded file (without extension) */
  filename: string
  /** The markdown content to download */
  content: string
}
```

---

## Future: AI Integration Roadmap

### Where to Add AI

The architecture is designed for a **single-function swap**. Replace the `convertText` function in `src/hooks/useConvertText.ts`:

```typescript
// CURRENT: Mock implementation
async function convertText(input: ConversionInput): Promise<ConversionResponse> {
  await new Promise(resolve => setTimeout(resolve, 500))
  // ... mock logic
}

// FUTURE: Real AI implementation
async function convertText(input: ConversionInput): Promise<ConversionResponse> {
  const response = await fetch('/api/convert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: input.text })
  })
  
  if (!response.ok) {
    return { markdown: '', success: false, error: 'Conversion failed' }
  }
  
  const data = await response.json()
  return { markdown: data.markdown, success: true }
}
```

### Suggested AI Providers

| Provider | Pros | Cons |
|----------|------|------|
| **OpenAI GPT-4** | Best quality, well-documented | Cost, rate limits |
| **Anthropic Claude** | Great for structured output | Newer API |
| **Google Gemini** | Good free tier | Less markdown-focused |
| **Local (Ollama)** | Free, private | Requires setup, slower |

### Environment Variables

Create `.env.local` for API keys:

```env
VITE_AI_API_URL=https://api.openai.com/v1/chat/completions
VITE_AI_API_KEY=sk-...
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_AI_API_URL
```

### Recommended API Route Structure

If adding a backend (Next.js API routes, Express, etc.):

```
POST /api/convert
Body: { text: string }
Response: { markdown: string }
```

### Error Handling Pattern

```typescript
async function convertText(input: ConversionInput): Promise<ConversionResponse> {
  try {
    const response = await fetch('/api/convert', { /* ... */ })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const data = await response.json()
    return { markdown: data.markdown, success: true }
    
  } catch (error) {
    console.error('Conversion failed:', error)
    return {
      markdown: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
```

---

## Future: Database Integration Roadmap

### Use Cases for Database

1. **Conversion History** - Store past conversions for reference
2. **Templates** - Save reusable markdown templates
3. **User Preferences** - Remember settings
4. **Analytics** - Track usage patterns

### Suggested Schema

```sql
-- Conversions table
CREATE TABLE conversions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  input_text  TEXT NOT NULL,
  output_md   TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Templates table
CREATE TABLE templates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  name        VARCHAR(255) NOT NULL,
  content     TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);
```

### Database Options

| Option | Type | Best For |
|--------|------|----------|
| **Supabase** | PostgreSQL (hosted) | Quick setup, auth included |
| **PlanetScale** | MySQL (serverless) | Scalability, branching |
| **Turso** | SQLite (edge) | Low latency, simple |
| **Prisma + PostgreSQL** | Any SQL | Type safety, migrations |

### Implementation with TanStack Query

```typescript
// src/hooks/useConversionHistory.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useConversionHistory() {
  return useQuery({
    queryKey: ['conversions'],
    queryFn: () => fetch('/api/conversions').then(r => r.json())
  })
}

export function useSaveConversion() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: { input: string, output: string }) =>
      fetch('/api/conversions', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversions'] })
    }
  })
}
```

---

## Possible Improvements

### UI Enhancements

| Improvement | Description | Complexity |
|-------------|-------------|------------|
| **Markdown Display Mode** | After conversion, show output in code-editor style (dark bg, monospace font) | Low |
| **Split View** | Side-by-side input/output panels | Medium |
| **Markdown Preview** | Render markdown with react-markdown | Low |
| **Syntax Highlighting** | Highlight code blocks | Medium |
| **Diff View** | Show before/after comparison | Medium |
| **Keyboard Shortcuts** | Ctrl+Enter to convert, etc. | Low |

#### Markdown Display Mode Implementation

After conversion, the textarea should switch to a "code editor" visual style to clearly indicate the output is markdown:

```typescript
// Conditional styling based on conversion state
<textarea
  className={`
    ${hasResult 
      ? 'bg-zinc-900 text-zinc-100 font-mono text-sm' 
      : 'bg-zinc-50 text-zinc-900'
    }
    // ... other classes
  `}
/>
```

**Visual changes after conversion:**
- Dark background (`bg-zinc-900`)
- Light text (`text-zinc-100`) 
- Monospace font (`font-mono`)
- Smaller text size (`text-sm`)
- Styled like viewing a `.md` file in VS Code

### Feature Ideas

| Feature | Description | Priority |
|---------|-------------|----------|
| **Conversion History** | List of past conversions | High |
| **Templates** | Preset markdown structures | Medium |
| **Batch Processing** | Convert multiple texts | Medium |
| **Export Options** | PDF, HTML, DOCX | Low |
| **Custom Prompts** | User-defined AI instructions | High (with AI) |

### Performance Optimizations

1. **Debounced Auto-save** - Save drafts while typing
   ```typescript
   const debouncedSave = useDebouncedCallback(saveDraft, 1000)
   ```

2. **Optimistic Updates** - Show result before API confirms
   ```typescript
   useMutation({
     mutationFn: convertText,
     onMutate: async (input) => {
       // Optimistically update UI
     }
   })
   ```

3. **Response Caching** - Cache identical conversions
   ```typescript
   useQuery({
     queryKey: ['convert', hashText(input)],
     staleTime: 1000 * 60 * 60, // 1 hour
   })
   ```

### Testing Strategy

| Type | Tool | Coverage |
|------|------|----------|
| **Unit Tests** | Vitest | Hooks, utilities |
| **Component Tests** | React Testing Library | UI components |
| **E2E Tests** | Playwright | Full user flows |

Example test setup:

```typescript
// src/hooks/useConvertText.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { useConvertText } from './useConvertText'

test('converts text successfully', async () => {
  const { result } = renderHook(() => useConvertText(), { wrapper })
  
  result.current.mutate({ text: 'Hello World' })
  
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.data?.markdown).toContain('# Hello World')
  })
})
```

---

## Changelog

### v1.0 (January 17, 2026)

- Initial release
- Mock text-to-markdown conversion
- Download as .md file
- Copy to clipboard
- Professional Zinc/Emerald UI theme
- Dark mode support
- TanStack Router file-based routing
- TanStack Query mutation pattern

---

## Contributing

1. Follow the existing file structure
2. Use TypeScript strict mode
3. Add types to `src/types/index.ts`
4. Use TanStack Query for all async operations
5. Follow Tailwind CSS conventions (Tailwind v4 syntax)

---

*Documentation generated January 17, 2026*
