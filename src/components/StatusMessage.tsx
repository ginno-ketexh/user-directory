type LoadingStateProps = {
  label?: string
}

export function LoadingState({ label = 'Loading users…' }: LoadingStateProps) {
  return (
    <div role="status" className="flex items-center gap-3 px-4 py-10 text-sm text-stone-600">
      <span
        aria-hidden="true"
        className="h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-teal-700"
      />
      {label}
    </div>
  )
}

type ErrorStateProps = {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="px-4 py-8">
      <p className="font-medium text-stone-900">Could not load users</p>
      <p className="mt-1 text-sm text-stone-600">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-lg bg-teal-700 px-3 py-2 text-sm font-medium text-white hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
      >
        Retry
      </button>
    </div>
  )
}
