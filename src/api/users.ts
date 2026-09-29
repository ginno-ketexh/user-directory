import { roles, type ApiUser, type DirectoryUser } from '../types.ts'

export const USERS_ENDPOINT = 'https://jsonplaceholder.typicode.com/users'

export async function fetchUsers(signal?: AbortSignal): Promise<DirectoryUser[]> {
  const response = await fetch(USERS_ENDPOINT, { signal })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`)
  }

  const data: unknown = await response.json()

  if (!Array.isArray(data)) {
    throw new Error('User response was not a list.')
  }

  return data.map((user) => toDirectoryUser(user as ApiUser))
}

function toDirectoryUser(user: ApiUser): DirectoryUser {
  const role = roles[user.id % roles.length]

  return {
    ...user,
    role,
  }
}
