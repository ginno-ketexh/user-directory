import type { DirectoryUser, RoleFilter } from './types.ts'

type UserCriteria = {
  search: string
  role: RoleFilter
}

export function filterUsers(users: DirectoryUser[], criteria: UserCriteria): DirectoryUser[] {
  const query = criteria.search.trim().toLowerCase()

  return users.filter((user) => {
    const matchesName = user.name.toLowerCase().includes(query)
    const matchesRole = criteria.role === 'all' || user.role === criteria.role
    return matchesName && matchesRole
  })
}
