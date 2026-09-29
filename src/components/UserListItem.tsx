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
        className={`flex w-full items-center py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus ${
          selected ? 'justify-between bg-selected pl-3 pr-4' : 'bg-white px-4 hover:bg-canvas'
        }`}
      >
        {selected ? (
          <span aria-hidden="true" className="h-12 w-1 shrink-0 rounded-[2px] bg-accent-bar" />
        ) : null}
        <span className={`flex min-w-0 flex-col gap-0.5 ${selected ? 'max-w-[70%]' : ''}`}>
          <span className="text-sm font-semibold leading-normal text-ink">{user.name}</span>
          <span className="text-xs font-medium leading-normal text-accent">{user.role}</span>
          <span className="break-words text-xs leading-normal text-muted">{user.email}</span>
        </span>
        {selected ? (
          <span aria-hidden="true" className="shrink-0 text-[11px] font-bold leading-normal text-accent">
            SELECTED
          </span>
        ) : null}
      </button>
    </li>
  )
}
