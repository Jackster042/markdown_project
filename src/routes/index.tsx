import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          Text to Markdown
        </h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          Foundation scaffolding complete. Ready for Step 2.
        </p>
      </div>
    </div>
  )
}
