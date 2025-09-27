import type { PaginationEnvelope } from '@/lib/api'
import { http } from '@/lib/api'
import type { EmployeeInvite, InviteRole } from '@/lib/types'

const DEFAULT_PAGE_SIZE = 10

export async function createInvite(
  yardId: string,
  payload: { name: string; email: string; role: InviteRole }
) {
  return await http<EmployeeInvite>(`/yards/${yardId}/invites`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function listInvitesByYard(
  yardId: string,
  params?: { pageNumber?: number; pageSize?: number }
) {
  const pageNumber = params?.pageNumber ?? 1
  const pageSize = params?.pageSize ?? DEFAULT_PAGE_SIZE
  return await http<PaginationEnvelope<EmployeeInvite>>(
    `/yards/${yardId}/invites`,
    {
      method: 'GET',
      query: { pageNumber, pageSize },
    }
  )
}

export async function listInvitesByEmail(
  email: string,
  params?: { pageNumber?: number; pageSize?: number }
) {
  const pageNumber = params?.pageNumber ?? 1
  const pageSize = params?.pageSize ?? DEFAULT_PAGE_SIZE
  return await http<PaginationEnvelope<EmployeeInvite>>(
    `/invites/email/${encodeURIComponent(email)}`,
    {
      method: 'GET',
      query: { pageNumber, pageSize },
    }
  )
}

export async function acceptInvite(token: string, payload: { userId: string }) {
  return await http(`/invites/${encodeURIComponent(token)}/accept`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function rejectInvite(token: string) {
  return await http(`/invites/${encodeURIComponent(token)}/reject`, {
    method: 'POST',
    body: JSON.stringify({}),
  })
}
