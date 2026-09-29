import { useMemo, useState } from 'react'
import { filterUsers } from '../filterUsers.ts'
import { useUsers } from '../hooks/useUsers.ts'
import type { RoleFilter } from '../types.ts'
import { RoleFilter as RoleFilterControl } from './RoleFilter.tsx'
import { ErrorState, LoadingState } from './StatusMessage.tsx'
import { UserDetails } from './UserDetails.tsx'
import { UserList } from './UserList.tsx'
import { UserSearch } from './UserSearch.tsx'

export function UserDirectory() {
  const { users, status, errorMessage, retry } = useUsers()
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<RoleFilter>('all')
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const filteredUsers = useMemo(
    () => filterUsers(users, { search, role }),
    [users, search, role],
  )

  const selectedUser = users.find((user) => user.id === selectedId) ?? null

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">User Directory</h1>
          <p className="mt-1 max-w-2xl text-sm text-stone-600">
            Browse people from the directory. Search by name and filter by role.
          </p>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-4 px-4 py-4 sm:px-6 sm:py-6">
        <div className="grid gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_220px] sm:items-end">
          <UserSearch value={search} onChange={setSearch} />
          <RoleFilterControl value={role} onChange={setRole} />
        </div>

        <div className="grid items-start gap-4 lg:grid-cols-2">
          <section
            aria-labelledby="users-heading"
            className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm"
          >
            <div className="border-b border-stone-200 px-4 py-3">
              <h2
                id="users-heading"
                className="text-sm font-semibold uppercase tracking-wide text-stone-500"
              >
                Users
              </h2>
            </div>
            {status === 'loading' ? <LoadingState /> : null}
            {status === 'error' ? (
              <ErrorState
                message={errorMessage ?? 'Something went wrong while loading users.'}
                onRetry={() => {
                  void retry()
                }}
              />
            ) : null}
            {status === 'success' ? (
              <UserList
                users={filteredUsers}
                selectedId={selectedId}
                onSelect={(user) => setSelectedId(user.id)}
              />
            ) : null}
          </section>

          <UserDetails user={selectedUser} />
        </div>
      </main>
    </div>
  )
}
