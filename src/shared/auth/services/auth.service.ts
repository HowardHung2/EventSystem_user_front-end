import { httpService } from '@/shared/http/services/http.service'
import { LoginData, LoginPayload, TokenStore } from '../models/auth.model'

const ACCESS_TOKEN_KEY =
  import.meta.env.VITE_ACCESS_TOKEN_KEY ??
  import.meta.env.ACCESS_TOKEN_KEY ??
  'access_token'
const API_CATEGORY = 'auth'

class AuthService {
  private tokenStore: TokenStore = {
    get: () => localStorage.getItem(ACCESS_TOKEN_KEY),
    set: (token) => localStorage.setItem(ACCESS_TOKEN_KEY, token),
    clear: () => localStorage.removeItem(ACCESS_TOKEN_KEY),
  }

  private extractToken(data: LoginData | null | undefined) {
    if (!data) {
      return null
    }
    return data.accessToken || data.token || null
  }

  getToken() {
    return this.tokenStore.get()
  }

  async login(payload: LoginPayload) {
    const endpoint = `${API_CATEGORY}/login`
    const res = await httpService.fetch<LoginData>(endpoint, {
      method: 'POST',
      body: payload,
    })

    const token = this.extractToken(res.data)
    if (token) {
      this.tokenStore.set(token)
    }

    return res
  }

  async refresh() {
    const endpoint = `${API_CATEGORY}/refresh`
    const res = await httpService.fetch<LoginData>(endpoint, {
      method: 'POST',
    })

    const token = this.extractToken(res.data)
    if (res.status && token) {
      this.tokenStore.set(token)
      return res
    }

    this.logout()
    return {
      ...res,
      status: false,
    }
  }

  logout() {
    this.tokenStore.clear()
  }

  isLoggedIn() {
    return Boolean(this.tokenStore.get())
  }
}

export const authService = new AuthService()
