import { API_URL } from './config'

let authToken: string | null = null
let onUnauthorized: (() => void) | null = null

export function setAuthToken(token: string | null) {
  authToken = token
}

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler
}

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...init.headers,
      },
    })
  } catch {
    throw new ApiError('Could not reach FitSync. Check your connection.', 0)
  }

  const data = await response.json().catch(() => null)
  if (response.status === 401 && authToken) onUnauthorized?.()
  if (!response.ok) {
    throw new ApiError(data?.error || 'Something went wrong. Please try again.', response.status)
  }
  return data as T
}
