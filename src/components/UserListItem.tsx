import type { DirectoryUser } from '../types.ts'

type UserListItemProps = {
  user: DirectoryUser
  selected: boolean
  onSelect: (user: DirectoryUser) => void
}

export function UserListItem({ user, selected, onSelect }: UserListItemProps) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(user)}
        aria-pressed={selected}
        className={`flex w-full flex-col gap-0.5 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-700 ${
          selected ? 'bg-teal-50' : 'bg-white hover:bg-stone-50'
        }`}
      >
        <span className="flex items-baseline justify-between gap-3">
          <span className="font-medium text-stone-900">{user.name}</span>
          {selected ? (
            <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-teal-800">
              Selected
            </span>
          ) : null}
        </span>
        <span className="text-sm text-teal-800">{user.role}</span>
        <span className="text-sm text-stone-500">{user.email}</span>
      </button>
    </li>
  )
}
