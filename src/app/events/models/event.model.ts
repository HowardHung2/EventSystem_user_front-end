// 資料（Model）

export type EventType = 'compulsory' | 'optional'
export type UserIntent = 'attend' | 'leave' | 'skip' // 參加 | 請假 | 不參加
export interface EventItem {
  id: string
  title: string
  start: Date
  end: Date
  type: EventType
  // status: pending(待處理) | registered(已回應/已報名) | absent(缺席)
  status: 'pending' | 'registered' | 'attended' | 'absent'
  // 使用者的選擇結果 (綠/橘/灰 燈號)
  userIntent?: UserIntent
  location?: string
  hours?: number
  content?: string
  // 報名截止時間
  registrationEnd: Date
}
