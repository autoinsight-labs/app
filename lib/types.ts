export interface Link {
  href: string
  rel: string
  method: string
  title?: string
  type?: string
}

export interface Address {
  id?: string | null
  country: string
  state: string
  city: string
  zipCode: string
  neighborhood: string
  complement?: string | null
}

export interface Yard {
  id: string
  ownerId: string
  address: Address
  links?: Link[]
}

export type YardPatch = Partial<{
  ownerId: string
  address: Partial<Address>
}>

export interface YardEmployee {
  id: string
  name: string
  imageUrl: string
  role: 'ADMIN' | 'MEMBER'
  userId: string
  links?: Link[]
}

export interface PaginationEnvelope<T> {
  pageNumber: number
  pageSize: number
  totalPages: number
  totalRecords: number
  data: T[]
  links?: Link[]
}

export type InviteRole = 'ADMIN' | 'MEMBER'
export type InviteStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'

export interface EmployeeInvite {
  id: string
  token: string
  yardId: string
  email: string
  name?: string
  role: InviteRole
  status: InviteStatus
  createdAt?: string
  acceptedAt?: string | null
  acceptedByUserId?: string | null
  links?: Link[]
}
