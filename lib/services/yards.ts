import type { PaginationEnvelope } from '@/lib/api'
import { http } from '@/lib/api'
import type { Yard, YardPatch } from '@/lib/types'

const DEFAULT_PAGE_SIZE = 10

export interface ListYardsParams {
  pageNumber?: number
  pageSize?: number
}

export async function listYards(params: ListYardsParams = {}) {
  const { pageNumber = 1, pageSize = DEFAULT_PAGE_SIZE } = params
  return await http<PaginationEnvelope<Yard>>('/yards', {
    method: 'GET',
    query: { pageNumber, pageSize },
  })
}

export async function createYard(payload: Pick<Yard, 'ownerId' | 'address'>) {
  return await http<Yard>('/yards', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getYard(id: string) {
  return await http<Yard>(`/yards/${id}`, { method: 'GET' })
}

export async function patchYard(id: string, patch: YardPatch) {
  return await http<Yard>(`/yards/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}

export async function deleteYard(id: string) {
  await http<unknown>(`/yards/${id}`, { method: 'DELETE' })
}
