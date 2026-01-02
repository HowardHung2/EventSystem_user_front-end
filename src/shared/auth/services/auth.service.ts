import { TokenStore } from "../models/auth.model"

const ACCESS_TOKEN_KEY = 'access_token'

export const tokenStore: TokenStore = {
  get() {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },
  set(token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  },
  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
  }
}
