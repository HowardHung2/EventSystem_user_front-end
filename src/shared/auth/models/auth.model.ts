// 登入資料（Model）

export type TokenStore = {
  get: () => string | null
  set: (token: string) => void
  clear: () => void
}

export type LoginPayload = Record<string, unknown>
export type LoginData = {
  accessToken?: string
  token?: string
  [key: string]: unknown
}
