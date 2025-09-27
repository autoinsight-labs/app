const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:5100'

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

export interface PaginationEnvelope<T> {
  pageNumber: number
  pageSize: number
  totalPages: number
  totalRecords: number
  data: T[]
  links?: Array<{
    href: string
    rel: string
    method: string
    title?: string
    type?: string
  }>
}

export interface ApiError extends Error {
  status?: number
  details?: unknown
}

export function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  const base = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`
  const url = new URL(path.replace(/^\//, ''), base)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue
      url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

export async function http<T>(
  path: string,
  init?: RequestInit & {
    query?: Record<string, string | number | boolean | undefined>
  }
) {
  const { query, headers, ...rest } = init ?? {}

  const url = buildUrl(path, query)
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...rest,
  })

  if (!response.ok) {
    let body: unknown = null
    try {
      if (response.status !== 204) {
        body = await response.json()
      }
    } catch {}

    type ErrorBody = {
      message?: string
      error?: string
      title?: string
    } & Record<string, unknown>
    const eb = (body ?? {}) as ErrorBody
    const err: ApiError = new Error(
      eb.message ||
        eb.error ||
        eb.title ||
        `Request failed with status ${response.status}`
    )
    err.status = response.status
    err.details = body
    throw err
  }

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  if (!text) {
    return undefined as T
  }
  try {
    return JSON.parse(text) as T
  } catch {
    // Non-JSON response
    return undefined as T
  }
}
