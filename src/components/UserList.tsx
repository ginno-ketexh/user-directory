import type { DirectoryUser } from '../types.ts'
import { UserListItem } from './UserListItem.tsx'

type UserListProps = {
  users: DirectoryUser[]
  selectedId: number | null
  onSelect: (user: DirectoryUser) => void
}

function resultsLabel(count: number): string {
  return count === 1 ? '1 user found' : `${count} users found`
}

export function UserList({ users, selectedId, onSelect }: UserListProps) {
  const count = (
    <p className="sr-only" aria-live="polite" aria-atomic="true">
      {resultsLabel(users.length)}
    </p>
  )

  if (users.length === 0) {
    return (
      <>
        {count}
        <div role="status" className="flex flex-col items-center gap-2 px-8 py-8 text-center">
          <p className="text-base font-semibold leading-[normal] text-ink">No users found</p>
          <p className="text-[13px] leading-[normal] text-muted">Try a different name or role filter.</p>
        </div>
      </>
    )
  }

  return (
    <>
      {count}
      <ul aria-label="Users" className="divide-y divide-line xl:max-h-[32rem] xl:overflow-y-auto">
        {users.map((user) => (
          <UserListItem
            key={user.id}
            user={user}
            selected={user.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </>
  )
}
