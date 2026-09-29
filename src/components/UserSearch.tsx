type UserSearchProps = {
  value: string
  onChange: (value: string) => void
}

const controlClass =
  'w-full rounded-lg border border-line bg-white px-3 py-[11px] text-sm leading-[normal] text-ink outline-none placeholder:text-faint focus-visible:border-focus focus-visible:shadow-focus'

export function UserSearch({ value, onChange }: UserSearchProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <label htmlFor="user-search" className="text-xs font-medium leading-[normal] text-muted">
        Search by name
      </label>
      <input
        id="user-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search users…"
        autoComplete="off"
        className={controlClass}
      />
    </div>
  )
}
