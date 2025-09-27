import type { PaginationEnvelope } from '@/lib/api'
import { http } from '@/lib/api'
import type { YardEmployee } from '@/lib/types'

const DEFAULT_PAGE_SIZE = 10

export interface ListEmployeesParams {
  yardId: string
  pageNumber?: number
  pageSize?: number
}

export async function listYardEmployees(params: ListEmployeesParams) {
  const { yardId, pageNumber = 1, pageSize = DEFAULT_PAGE_SIZE } = params
  return await http<PaginationEnvelope<YardEmployee>>(
    `/yards/${yardId}/employees`,
    {
      method: 'GET',
      query: { pageNumber, pageSize },
    }
  )
}