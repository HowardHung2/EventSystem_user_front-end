// 個人檔案資料（Model）

export interface UserProfile {
  id: string
  username: string // 帳號 (系統識別用)
  role: '使用者' | '管理員' | '超級管理員' | '檢視者'
  name: string // 姓名
  nickname: string // 暱稱
  gender: '生理男' | '生理女' | '其他' // 性別
  email: string // 電子郵件
  school: string // 學校
  primaryContact: string // 主要聯絡人
  phone: string // 電話
  isPublicContact: boolean // 是否公開聯絡資訊
  interestedIssues: string // 關注議題
  dietaryPreference: '葷' | '全素' | '蛋奶素' | '其他' // 飲食習慣
  dietaryNote: string // 忌口食物 / 備註
  notes: string // 備註 (其他)
  avatarUrl?: string // 大頭貼 (保留)
}
