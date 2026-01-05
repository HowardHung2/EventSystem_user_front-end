export interface ApiResponse<T = any> {
  status: boolean // 或 number，看你後端是回傳 true/false 還是 200/400
  message: string
  data: T // 這裡就是重點，data 的型別由外部決定
}

export interface ApiOptions extends Omit<RequestInit, 'body'> {
  body?: any
}
