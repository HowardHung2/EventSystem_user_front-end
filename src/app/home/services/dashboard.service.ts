// 資料存取（Service）
import type { DashboardStats } from '../models/dashboard.model'

// 模擬假資料
const MOCK_STATS: DashboardStats = {
  leaveCount: 1,
  absenceCount: 3,
  kpiScore: 30,
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    // TODO: 未來串接後端時，改為 return axios.get('/api/dashboard/stats')
    console.log('正在獲取儀表板數據...')
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_STATS), 500))
  },
}
