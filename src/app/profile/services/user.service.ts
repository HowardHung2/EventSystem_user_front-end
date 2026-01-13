// 個人設定資料存取（Service）
import type { UserProfile } from '../models/user.model'

// 模擬資料庫裡的原始資料
let MOCK_DB_USER: UserProfile = {
  id: 'u001',
  username: 'admin',
  role: '超級管理員',
  name: '王小明',
  nickname: '小明',
  gender: '生理男',
  email: 'ming@example.com',
  school: '國立臺灣大學',

  primaryContact: '陳大華 (父親)',
  phone: '0912-345-678',
  isPublicContact: true,

  interestedIssues: '環境保護, 程式教育, 偏鄉服務',
  dietaryPreference: '葷',
  dietaryNote: '不吃香菜',
  notes: '我平日晚上比較方便聯絡。',

  avatarUrl: '',
}

// 用來儲存「正在進行中」的請求 Promise
let fetchPromise: Promise<UserProfile> | null = null

export const userService = {
  async getProfile(): Promise<UserProfile> {
    // 1. 檢查：如果目前已經有請求在跑，直接回傳那個 Promise (攔截重複請求)
    if (fetchPromise) {
      console.log('⚡ 偵測到重複請求，重用現有 Promise，不發送新請求')
      return fetchPromise
    }

    console.log('🚀 正在向後端取得個人資料...')

    // 2. 建立新的 Promise 並存起來
    fetchPromise = new Promise<UserProfile>((resolve) => {
      setTimeout(() => {
        resolve({ ...MOCK_DB_USER })
      }, 500)
    }).finally(() => {
      // 3. 請求結束後（無論成功失敗），清空變數
      // 這樣下次使用者如果手動刷新或更新資料後，才能發送新的請求
      fetchPromise = null
    })

    return fetchPromise
  },

  async updateProfile(data: UserProfile): Promise<boolean> {
    console.log('💾 正在上傳更新資料...', data)
    await new Promise((resolve) => setTimeout(resolve, 800))

    // 更新模擬資料庫
    MOCK_DB_USER = { ...data }

    return true
  },
}
