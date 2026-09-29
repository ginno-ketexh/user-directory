import { useEffect, useMemo, useRef, useState } from 'react'
import { filterUsers } from '../filterUsers.ts'
import { useUsers } from '../hooks/useUsers.ts'
import type { RoleFilter } from '../types.ts'
import { RoleFilter as RoleFilterControl } from './RoleFilter.tsx'
import { ErrorState, LoadingState } from './StatusMessage.tsx'
import { UserDetails } from './UserDetails.tsx'
import { UserList } from './UserList.tsx'
import { UserSearch } from './UserSearch.tsx'

const cardClass = 'overflow-hidden rounded-xl border border-line bg-white shadow-card'

export function UserDirectory() {
  const { users, status, retry } = useUsers()
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<RoleFilter>('all')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const detailsRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (selectedId == null || typeof window.matchMedia !== 'function') {
      return
    }

    // Stacked below the lg breakpoint (1024px); side by side from there up.
    const isNarrow = window.matchMedia('(max-width: 1023px)').matches
    if (!isNarrow) {
      return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    detailsRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }, [selectedId])

  const filteredUsers = useMemo(
    () => filterUsers(users, { search, role }),
    [users, search, role],
  )

  const selectedUser = users.find((user) => user.id === selectedId) ?? null

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-4 pb-8 pt-6 md:gap-6 md:px-6 md:pb-12 md:pt-10 xl:px-12">
        <header className="flex flex-col gap-1.5 md:gap-2">
          <h1 className="text-[22px] font-bold leading-[normal] md:text-[28px]">User Directory</h1>
          <p className="max-w-2xl text-[13px] leading-[normal] text-muted md:text-sm">
            Browse people from the directory. Search by name and filter by role.
          </p>
        </header>

        <main className="flex flex-col gap-4 md:gap-6">
          <div className="flex flex-col gap-3 rounded-xl border border-line bg-white p-4 shadow-card lg:flex-row lg:items-start lg:gap-4">
            <UserSearch value={search} onChange={setSearch} />
            <RoleFilterControl value={role} onChange={setRole} />
          </div>

          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,497fr)_minmax(0,671fr)]">
            <section aria-labelledby="users-heading" className={`min-w-0 ${cardClass}`}>
              <div className="border-b border-line px-4 pb-2.5 pt-3.5">
                <h2 id="users-heading" className="text-[11px] font-bold uppercase text-faint">
                  Users
                </h2>
              </div>
              {status === 'loading' ? <LoadingState /> : null}
              {status === 'error' ? (
                <ErrorState
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

            <UserDetails user={selectedUser} sectionRef={detailsRef} />
          </div>
        </main>
      </div>
    </div>
  )
}
