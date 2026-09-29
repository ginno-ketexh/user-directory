import type { DirectoryUser } from '../types.ts'
import { UserListItem } from './UserListItem.tsx'

type UserListProps = {
  users: DirectoryUser[]
  selectedId: number | null
  onSelect: (user: DirectoryUser) => void
}

export function UserList({ users, selectedId, onSelect }: UserListProps) {
  if (users.length === 0) {
    return <p className="px-4 py-10 text-sm text-stone-600">No users found.</p>
  }

  return (
    <ul aria-label="Users" className="max-h-[32rem] divide-y divide-stone-200 overflow-y-auto">
      {users.map((user) => (
        <UserListItem
          key={user.id}
          user={user}
          selected={user.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </ul>
  )
}
