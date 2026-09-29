export const roles = [
  'Engineer',
  'Designer',
  'Product Manager',
  'QA Engineer',
] as const

export type Role = (typeof roles)[number]

export type RoleFilter = 'all' | Role

export type ApiUser = {
  id: number
  name: string
  username: string
  email: string
  address?: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  phone: string
  website: string
  company?: {
    name: string
    catchPhrase: string
    bs: string
  }
}

export type DirectoryUser = ApiUser & {
  role: Role
}
