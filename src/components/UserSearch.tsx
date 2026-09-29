type UserSearchProps = {
  value: string
  onChange: (value: string) => void
}

export function UserSearch({ value, onChange }: UserSearchProps) {
  return (
    <div>
      <label htmlFor="user-search" className="mb-1.5 block text-sm font-medium text-stone-700">
        Search by name
      </label>
      <input
        id="user-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search users..."
        autoComplete="off"
        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm placeholder:text-stone-400 focus-visible:border-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
      />
    </div>
  )
}
