// 資料（Model）

export interface Contact {
  id: number
  name: string
  gender: string
  email: string
  tag: string
  // 未來後端通常會用 ID 來關聯，這裡我們先模擬加個 groupId
  groupId?: number
}

export interface Group {
  id: number
  name: string
  count: number
}
