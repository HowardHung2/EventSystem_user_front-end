// 登入資料存取（Service）

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
    // ---------------------------------------------------------
    // [原本的真實後端程式碼] -> 先註解起來，等後端做好了再打開
    // const endpoint = `${API_CATEGORY}/login`
    // const res = await httpService.fetch<LoginData>(endpoint, {
    //   method: 'POST',
    //   body: payload,
    // })
    // ---------------------------------------------------------

    console.log('正在嘗試登入...', payload)

    await new Promise((resolve) => setTimeout(resolve, 800))

    // 模擬驗證邏輯：只要密碼是 123456 就成功
    if (payload.password === '123456') {
      const mockToken = 'mock-token-abc-123'
      tokenService.set(mockToken)

      return {
        status: true,
        data: {
          accessToken: mockToken,
          user: { name: payload.username || '測試人員' },
        },
      }
    } else {
      throw new Error('帳號或密碼錯誤 (模擬)')
    }
  }

  async refresh() {
    this.logout()
    return { status: false, data: null }
  }

  logout() {
    tokenService.clear()
  }

  isLoggedIn() {
    return Boolean(tokenService.get())
  }
}

export const authService = new AuthService()
