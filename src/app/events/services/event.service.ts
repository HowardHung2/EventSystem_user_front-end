// 資料存取（Service）

import type { EventItem, UserIntent } from '../models/event.model'

const NOW = new Date()

// 取得「N天後」的日期 (負數代表N天前)
const daysFromNow = (n: number) => {
  const d = new Date(NOW)
  d.setDate(d.getDate() + n)
  return d
}

// 取得「某時間往後推 N 小時」的日期 (用於計算結束時間)
const addHours = (date: Date, hours: number) => {
  const d = new Date(date)
  d.setTime(d.getTime() + hours * 60 * 60 * 1000)
  return d
}

// 測試資料

const MOCK_EVENTS: EventItem[] = [
  {
    id: '1',
    title: '2026 第一季全員大會',
    start: daysFromNow(7),
    end: addHours(daysFromNow(7), 3),
    registrationEnd: daysFromNow(1),
    type: 'compulsory',
    status: 'pending',
    hours: 3,
    content: '說明本季公司營運目標。',
  },
  {
    id: '2',
    title: 'Vue 3 前端開發工作坊',
    start: daysFromNow(2),
    end: addHours(daysFromNow(2), 8),
    registrationEnd: daysFromNow(1),
    type: 'compulsory',
    status: 'registered',
    userIntent: 'attend',
    hours: 6,
    content: '前端技術深耕課程。',
  },
  {
    id: '3',
    title: '兒少身心健康講座',
    start: daysFromNow(-1),
    end: daysFromNow(-1),
    registrationEnd: daysFromNow(-1),
    type: 'optional',
    status: 'registered',
    userIntent: 'leave',
    hours: 8,
    content: '身心健康相關講座。',
  },
  {
    id: '4',
    title: '期末專題發表預演',
    start: daysFromNow(7),
    end: daysFromNow(7),
    registrationEnd: daysFromNow(1),
    type: 'optional',
    status: 'registered',
    userIntent: 'skip',
    hours: 2,
  },
  {
    id: '5',
    title: '消防安全演練',
    start: daysFromNow(-30),
    end: daysFromNow(-30),
    registrationEnd: daysFromNow(-1),
    type: 'compulsory',
    status: 'absent',
    hours: 1,
  },
  {
    id: '6',
    title: '部門慶生會',
    start: daysFromNow(5),
    end: addHours(daysFromNow(5), 2),
    registrationEnd: daysFromNow(3),
    type: 'optional',
    status: 'pending',
    hours: 0,
  },
  {
    id: '7',
    title: '資安宣導課程',
    start: daysFromNow(10),
    end: addHours(daysFromNow(10), 2),
    registrationEnd: daysFromNow(5),
    type: 'compulsory',
    status: 'registered',
    userIntent: 'leave',
    hours: 2,
  },
  {
    id: '8',
    title: '新進人員教育訓練',
    start: daysFromNow(20),
    end: addHours(daysFromNow(20), 8),
    registrationEnd: daysFromNow(15),
    type: 'compulsory',
    status: 'pending',
    hours: 8,
  },
  {
    id: '9',
    title: 'React Native 分享會',
    start: daysFromNow(-30),
    end: daysFromNow(-30),
    registrationEnd: daysFromNow(-1),
    type: 'optional',
    status: 'attended',
    userIntent: 'attend',
    hours: 2,
  },
  {
    id: '10',
    title: '專案管理 PMP 講座',
    start: daysFromNow(1),
    end: daysFromNow(1),
    registrationEnd: addHours(NOW, 0.2),
    type: 'compulsory',
    status: 'registered',
    userIntent: 'attend',
    hours: 3,
  },
]

// 資料存取
let currentSelectedEventId: string | null = null
let savedView: 'calendar' | 'list' = 'list'

export const eventService = {
  // 模擬從後端抓取資料
  async getEvents(year: number, month: number): Promise<EventItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return MOCK_EVENTS
  },

  // 設定當前選中的活動
  setSelectedEvent(id: string) {
    currentSelectedEventId = id
  },

  // 取得當前選中的活動
  async getCurrentEvent(): Promise<EventItem | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return MOCK_EVENTS.find((e) => e.id === currentSelectedEventId)
  },

  // 記住使用者上次是看列表還是行事曆
  getSavedView() {
    return savedView
  },
  setSavedView(view: 'calendar' | 'list') {
    savedView = view
  },

  // 模擬送出報名
  async submitRegistration(id: string, intent: UserIntent, formData: any) {
    const event = MOCK_EVENTS.find((e) => e.id === id)
    if (event) {
      event.status = 'registered'
      event.userIntent = intent
      console.log(`[Mock API] 更新活動 ${id} 狀態為: ${intent}`, formData)
    }
  },
}
