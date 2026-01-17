# Internal Text-to-Markdown Tool

## Project Overview

A professional internal tool for converting raw text into structured Markdown files. Built with a "Backend-Ready" architecture to allow for future AI integration while functioning entirely client-side for the initial prototype.

## Tech Stack

- **Package Manager:** pnpm
- **Frontend:** Vite + React + TypeScript
- **Routing:** TanStack Router (File-based)
- **State/Data Fetching:** TanStack Query (to mock future API calls)
- **Styling:** Tailwind CSS + Lucide React
- **Icons:** lucide-react

---

## Sequential Implementation Steps

### Step 1: Foundation & Scaffolding

- Initialize Vite project with `pnpm create vite . --template react-ts`.
- Install dependencies:
  ```bash
  pnpm add @tanstack/react-router @tanstack/react-query lucide-react
  pnpm add -D tailwindcss postcss autoprefixer
  pnpm dlx tailwindcss init -p
  ```
- Configure `tailwind.config.js` and `index.css`.
- Setup TanStack Router folder structure:
  - Create `src/routes` directory.
  - Create `src/main.tsx` with `RouterProvider` and `QueryClientProvider`.

### Step 2: Main Layout & Routing

- Create `src/routes/__root.tsx` for the global layout (Navbar, Footer, Container).
- Create `src/routes/index.lazy.tsx` for the primary workspace.
- Implement a clean, professional UI using Zinc/Slate color palette.

### Step 3: Markdown Logic & Mock Mutation

- Create a custom hook `useConvertText` using TanStack Query's `useMutation`.
- Logic: The mutation should accept raw text, wait 500ms (simulate AI), and return the text.
- This architectural choice ensures that swapping to a real AI backend later only requires changing one function.

### Step 4: File Generation Service

- Implement the `downloadMarkdown` utility:
  - Uses Blob with type `text/markdown`.
  - Uses URL.createObjectURL and a temporary `<a>` tag to trigger the download.
  - Cleans up the URL object after download to prevent memory leaks.

### Step 5: Workspace UI Implementation

- Input Area: High-quality Tailwind-styled textarea with focus rings and character count.
- Action Bar:
  - Convert & Download button (primary).
  - Copy to Clipboard button (secondary).
  - Clear button (ghost).
- Feedback: Show a loading spinner (`Lucide Loader2`) when the "mutation" is in flight.
---

def architecture notes for cursor:
- State Management: Keep the raw input state local to the component, but the "transformed" result should flow through TanStack Query.
- Styling: Use tailwind-merge and clsx for cleaner conditional classes if needed.
- Types: Ensure the DownloadOptions and ConversionResponse are strictly typed in src/types/index.ts.