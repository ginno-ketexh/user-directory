const skeletonRows = [0, 1, 2, 3]

export function LoadingState() {
  return (
    <div role="status" className="flex flex-col items-start gap-3.5 p-4">
      <div aria-hidden="true" className="flex flex-col gap-3.5">
        {skeletonRows.map((row) => (
          <div key={row} className="flex flex-col gap-2">
            <span className="h-3.5 w-40 rounded-md bg-skeleton" />
            <span className="h-3 w-[90px] rounded-md bg-skeleton" />
            <span className="h-3 w-[200px] rounded-md bg-skeleton" />
          </div>
        ))}
      </div>
      <p className="text-[13px] font-medium leading-[normal] text-muted">Loading users…</p>
    </div>
  )
}

type ErrorStateProps = {
  onRetry: () => void
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 px-6 py-6 text-center">
      <p className="text-base font-semibold leading-[normal] text-danger">Couldn’t load users</p>
      <p className="text-[13px] leading-[normal] text-muted">Check your connection, then try again.</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1f2937] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
      >
        Retry
      </button>
    </div>
  )
}
