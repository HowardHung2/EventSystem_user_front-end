import { tokenStore } from '@/shared/auth/services/auth.service'
import { ApiOptions, ApiResponse } from '../models/http.modles'

const ROOT_URL =
  import.meta.env.ROOT_URL ??
  ''

function buildUrl(endpoint: string) {
  if (!ROOT_URL) {
    return endpoint
  }
  const normalizedRoot = ROOT_URL.replace(/\/+$/, '')
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${normalizedRoot}${normalizedEndpoint}`
}

export async function apiFetch<T = any>(
  endpoint: string, 
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {

  const token = tokenStore.get()

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }

  let body = options.body
  
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    body = JSON.stringify(body)
  }

  try {
    const res = await fetch(buildUrl(endpoint), {
      ...options,
      headers: { ...defaultHeaders, ...(options.headers || {}) },
      body: body as BodyInit,
      credentials: 'include'
    })
    
    const data = await res.json().catch(() => null)

    if (data && typeof data === 'object') {
      return data as ApiResponse<T>
    }

    return {
      status: false,
      message: `Http Error: ${res.status} ${res.statusText}`,
      data: null as any
    }

  } catch (err: any) {
    console.error('API Fetch Error:', err)
    return {
      status: false,
      message: err.message || '網路連線異常，請稍後再試',
      data: null as any
    }
  }
}
