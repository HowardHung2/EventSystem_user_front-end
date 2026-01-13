<!-- 首頁UI -->

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  Edit,
  QuestionFilled,
  User,
  Message,
  School,
  PriceTag,
  UserFilled,
} from '@element-plus/icons-vue'
import { userService } from '@/app/profile/services/user.service'
import { dashboardService } from '../services/dashboard.service'
import type { UserProfile } from '@/app/profile/models/user.model'
import type { DashboardStats } from '../models/dashboard.model'

const isLoading = ref(true)
const user = ref<UserProfile | null>(null)
const stats = ref<DashboardStats>({
  leaveCount: 0,
  absenceCount: 0,
  kpiScore: 0,
})

const displayName = computed(
  () => user.value?.nickname || user.value?.name || '使用者',
)

const initData = async () => {
  isLoading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const [userData, statsData] = await Promise.all([
      userService.getProfile(),
      dashboardService.getStats(),
    ])
    user.value = userData
    stats.value = statsData
  } catch (error) {
    console.error('首頁資料載入失敗', error)
  } finally {
    isLoading.value = false
  }
}

const goToProfile = () => (window.location.href = '/profile')

onMounted(() => initData())
</script>

<template>
  <div class="home-dashboard">
    <div class="dashboard-grid">
      <div class="profile-section">
        <el-skeleton :loading="isLoading" animated class="full-height-skeleton">
          <template #template>
            <el-card
              class="profile-card skeleton-card"
              :body-style="{ padding: '0px', height: '100%' }"
            >
              <el-skeleton-item
                variant="image"
                style="width: 100%; height: 120px"
              />
              <div style="padding: 20px; flex: 1">
                <el-skeleton-item
                  variant="circle"
                  style="width: 80px; height: 80px; margin-top: -60px"
                />
                <el-skeleton :rows="4" style="margin-top: 20px" />
              </div>
            </el-card>
          </template>

          <template #default>
            <el-card
              class="profile-card hover-effect"
              :body-style="{ padding: '0px', height: '100%' }"
            >
              <div class="profile-cover">
                <div class="cover-content">
                  <span class="cover-role">{{
                    user?.role || '超級管理員'
                  }}</span>
                  <el-button
                    text
                    :icon="Edit"
                    class="edit-btn-float"
                    @click="goToProfile"
                    title="編輯資料"
                  />
                </div>
              </div>

              <div class="profile-body">
                <div class="profile-identity-block">
                  <el-avatar :size="80" class="profile-avatar">
                    <el-icon><UserFilled /></el-icon>
                  </el-avatar>

                  <div class="identity-text">
                    <span class="real-name">{{ user?.name }}</span>
                    <span class="nick-name">@{{ user?.nickname }}</span>
                  </div>
                </div>

                <div class="info-list">
                  <div class="info-row">
                    <div class="info-icon">
                      <el-icon><User /></el-icon>
                    </div>
                    <div class="info-content">
                      <label>性別</label>
                      <span>{{ user?.gender || '生理男' }}</span>
                    </div>
                  </div>

                  <div class="info-row">
                    <div class="info-icon">
                      <el-icon><Message /></el-icon>
                    </div>
                    <div class="info-content">
                      <label>電子郵件</label>
                      <span class="email-font">{{ user?.email }}</span>
                    </div>
                  </div>

                  <div class="info-row">
                    <div class="info-icon">
                      <el-icon><School /></el-icon>
                    </div>
                    <div class="info-content">
                      <label>學校 / 單位</label>
                      <span>{{ user?.school }}</span>
                    </div>
                  </div>

                  <div class="info-row">
                    <div class="info-icon">
                      <el-icon><PriceTag /></el-icon>
                    </div>
                    <div class="info-content">
                      <label>關注議題</label>
                      <div class="tags-container">
                        <span class="simple-text-tag">{{
                          user?.interestedIssues || '環境保護, 程式教育'
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </template>
        </el-skeleton>
      </div>

      <div class="stats-column">
        <el-skeleton :loading="isLoading" animated>
          <template #template>
            <div style="display: flex; gap: 20px; margin-bottom: 24px">
              <el-skeleton-item
                variant="rect"
                style="flex: 1; height: 120px; border-radius: 16px"
              />
              <el-skeleton-item
                variant="rect"
                style="flex: 1; height: 120px; border-radius: 16px"
              />
            </div>
          </template>
          <template #default>
            <div class="attendance-grid">
              <el-card class="stat-card hover-effect">
                <div class="stat-minimal-content">
                  <span class="stat-value-large">{{ stats.leaveCount }}</span>
                  <span class="stat-label-minimal">請假次數</span>
                </div>
              </el-card>

              <el-card class="stat-card hover-effect">
                <div class="stat-minimal-content">
                  <span class="stat-value-large danger">{{
                    stats.absenceCount
                  }}</span>
                  <span class="stat-label-minimal">無故缺席</span>
                </div>
              </el-card>
            </div>
          </template>
        </el-skeleton>

        <el-skeleton :loading="isLoading" animated class="flex-fill-skeleton">
          <template #template>
            <el-skeleton-item
              variant="rect"
              style="
                width: 100%;
                height: 100%;
                min-height: 250px;
                border-radius: 16px;
              "
            />
          </template>
          <template #default>
            <el-card class="kpi-card-white hover-effect">
              <div class="kpi-header">
                <h3>KPI 指標</h3>
                <el-tooltip
                  content="計算方式:(必要參與之實際出席次數 / 必要參與之需出席總次數) %"
                  placement="top"
                >
                  <el-icon class="help-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>

              <div class="kpi-body">
                <el-progress
                  type="dashboard"
                  :percentage="stats.kpiScore"
                  :color="stats.kpiScore < 60 ? '#f56c6c' : '#409eff'"
                  :stroke-width="12"
                  :width="160"
                  stroke-linecap="round"
                >
                  <template #default="{ percentage }">
                    <div class="kpi-content">
                      <span class="kpi-value">{{ percentage }}%</span>
                    </div>
                  </template>
                </el-progress>
              </div>
            </el-card>
          </template>
        </el-skeleton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-dashboard {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
}

.hover-effect {
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  border: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
}
.hover-effect:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

/* --- 佈局網格 --- */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 24px;
  align-items: stretch;
}

.full-height-skeleton,
.flex-fill-skeleton {
  height: 100%;
}
.full-height-skeleton :deep(.el-skeleton),
.flex-fill-skeleton :deep(.el-skeleton) {
  height: 100%;
}

/* --- 左側：個人資料卡片 --- */
.profile-section {
  height: 100%;
}
.profile-card {
  background: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.profile-cover {
  height: 110px;
  background: linear-gradient(120deg, #d9ecff 0%, #ecf5ff 100%);
  position: relative;
  padding: 16px 20px;
}
.cover-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.cover-role {
  margin: 0;
  font-size: 0.95rem;
  color: #0052d9;
  font-weight: 600;
  background: #cbe2ff;
  padding: 4px 12px;
  border-radius: 6px;
}
.edit-btn-float {
  color: #606266;
  font-size: 1.1rem;
  padding: 4px;
}
.edit-btn-float:hover {
  color: #409eff;
  background: transparent;
}

.profile-body {
  padding: 0 24px 32px 24px;
  position: relative;
  flex: 1;
}

.profile-avatar {
  border: 4px solid #fff;
  background: #409eff;
  margin-top: -40px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5rem;
  color: #fff;
}

.profile-identity-block {
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
}
.identity-text {
  margin-top: 12px;
}
.real-name {
  font-size: 1.5rem;
  font-weight: 800;
  color: #303133;
  margin-right: 8px;
}
.nick-name {
  color: #909399;
  font-size: 1rem;
  font-weight: normal;
}

/* 資訊列表 */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-row {
  display: flex;
  /* 修改點：關鍵對齊修正，讓圖示與右側文字塊垂直置中 */
  align-items: center;
  gap: 16px;
}
.info-icon {
  background: #f4f4f5;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #606266;
  flex-shrink: 0;
}
.info-content {
  display: flex;
  flex-direction: column;
}
.info-content label {
  font-size: 0.8rem;
  color: #909399;
  margin-bottom: 2px; /* 縮小間距讓視覺更緊湊 */
}
.info-content span {
  font-size: 1rem;
  color: #303133;
  font-weight: 500;
  line-height: 1.4;
}
.email-font {
  font-family: 'Roboto Mono', monospace;
}

/* 修改點：關注議題改為純文字樣式 */
.simple-text-tag {
  font-size: 1rem;
  color: #303133;
  font-weight: 500;
  /* 移除原本的 background, padding, color */
}

/* --- 右側：數據區 --- */
.stats-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
}
.attendance-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.stat-card {
  aspect-ratio: 1 / 0.8; /* 稍微扁一點 */
}
.stat-card :deep(.el-card__body) {
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* 完全置中 */
  height: 100%;
  box-sizing: border-box;
}

/* 修改點：右側簡約風格樣式 */
.stat-minimal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.stat-value-large {
  font-size: 3rem; /* 加大數字 */
  font-weight: 800;
  color: #303133;
  line-height: 1;
  margin-bottom: 8px;
}
.stat-value-large.danger {
  color: #f56c6c;
}
.stat-label-minimal {
  font-size: 1rem;
  color: #909399;
  font-weight: 500;
}

/* KPI 卡片保持原樣 */
.kpi-card-white {
  background: #fff;
  flex: 1;
  min-height: 280px;
  display: flex;
  flex-direction: column;
}
.kpi-card-white :deep(.el-card__body) {
  padding: 24px;
  flex: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.kpi-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #303133;
  font-weight: 700;
}
.help-icon {
  color: #c0c4cc;
  cursor: pointer;
  font-size: 1.1rem;
}
.help-icon:hover {
  color: #909399;
}

.kpi-body {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.kpi-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.kpi-value {
  font-size: 2.4rem;
  font-weight: 800;
  color: #303133;
}

/* RWD */
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    align-items: start;
  }
  .profile-cover {
    height: 90px;
  }
  .profile-avatar {
    margin-top: -35px;
    width: 70px;
    height: 70px;
    font-size: 1.6rem;
  }
  .stat-card {
    aspect-ratio: auto;
    min-height: 120px;
  }
  .kpi-card-white {
    min-height: 250px;
  }
}
</style>
