import { httpService } from '@/shared/http/services/http.service'
import { tokenService } from './token.service'
import type { LoginData, LoginPayload } from '../models/auth.model'

const API_CATEGORY = 'auth'

class AuthService {
  private extractToken(data: LoginData | null | undefined) {
    if (!data) {
      return null
    }
    return data.accessToken || data.token || null
  }

  getToken() {
    return tokenService.get()
  }

  async login(payload: LoginPayload) {
    const endpoint = `${API_CATEGORY}/login`
    const res = await httpService.fetch<LoginData>(endpoint, {
      method: 'POST',
      body: payload,
    })

    const token = this.extractToken(res.data)
    if (token) {
      tokenService.set(token)
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
      tokenService.set(token)
      return res
    }

    this.logout()
    return {
      ...res,
      status: false,
    }
  }

  logout() {
    tokenService.clear()
  }

  isLoggedIn() {
    return Boolean(tokenService.get())
  }
}

export const authService = new AuthService()
