import { roles, type ApiUser, type DirectoryUser, type Role } from '../types.ts'

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

  return data.flatMap((entry) => {
    const user = parseDirectoryUser(entry)
    return user ? [user] : []
  })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function readCompany(value: unknown): ApiUser['company'] | undefined {
  if (!isRecord(value) || typeof value.name !== 'string') {
    return undefined
  }

  return {
    name: value.name,
    catchPhrase: readString(value.catchPhrase),
    bs: readString(value.bs),
  }
}

function readAddress(value: unknown): ApiUser['address'] | undefined {
  if (!isRecord(value) || typeof value.city !== 'string') {
    return undefined
  }

  const geo = isRecord(value.geo) ? value.geo : undefined

  return {
    street: readString(value.street),
    suite: readString(value.suite),
    city: value.city,
    zipcode: readString(value.zipcode),
    geo: {
      lat: readString(geo?.lat),
      lng: readString(geo?.lng),
    },
  }
}

function roleForId(id: unknown): Role {
  const fallback = roles[0]

  if (typeof id !== 'number' || !Number.isFinite(id) || id < 0) {
    return fallback
  }

  const index = Math.trunc(id) % roles.length
  return roles[index] ?? fallback
}

function parseDirectoryUser(value: unknown): DirectoryUser | null {
  if (!isRecord(value) || typeof value.name !== 'string') {
    return null
  }

  if (typeof value.id !== 'number' || !Number.isFinite(value.id)) {
    return null
  }

  const address = readAddress(value.address)
  const company = readCompany(value.company)

  return {
    id: value.id,
    name: value.name,
    username: readString(value.username),
    email: readString(value.email),
    phone: readString(value.phone),
    website: readString(value.website),
    ...(address ? { address } : {}),
    ...(company ? { company } : {}),
    role: roleForId(value.id),
  }
}
