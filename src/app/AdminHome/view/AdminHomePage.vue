<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  Edit,
  User,
  Message,
  School,
  PriceTag,
  UserFilled,
} from '@element-plus/icons-vue'
import { userService } from '@/app/profile/services/user.service'
import type { UserProfile } from '@/app/profile/models/user.model'

const isLoading = ref(true)
const user = ref<UserProfile | null>(null)

const initData = async () => {
  isLoading.value = true
  try {
    user.value = await userService.getProfile()
  } catch (error) {
    console.error('管理員首頁資料載入失敗', error)
  } finally {
    isLoading.value = false
  }
}

const goToProfile = () => (window.location.href = '/profile')

onMounted(() => initData())
</script>

<template>
  <div class="admin-home-container">
    <div class="admin-content-wrapper">
      <el-skeleton :loading="isLoading" animated>
        <template #template>
          <el-card class="profile-card skeleton-card">
            <el-skeleton-item
              variant="image"
              style="width: 100%; height: 120px"
            />
            <div style="padding: 20px">
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
            :body-style="{ padding: '0px' }"
          >
            <div class="profile-cover">
              <div class="cover-content">
                <span class="cover-role">{{ user?.role || '管理員' }}</span>
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
              <div class="profile-header-row">
                <div class="profile-identity-block">
                  <el-avatar :size="80" class="profile-avatar">
                    <el-icon><UserFilled /></el-icon>
                  </el-avatar>
                  <div class="identity-text">
                    <span class="real-name">{{ user?.name }}</span>
                    <span class="nick-name">@{{ user?.nickname }}</span>
                  </div>
                </div>
              </div>

              <div class="info-grid">
                <div class="info-item">
                  <div class="info-icon">
                    <el-icon><User /></el-icon>
                  </div>
                  <div class="info-content">
                    <label>性別</label>
                    <span>{{ user?.gender || '生理男' }}</span>
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-icon">
                    <el-icon><Message /></el-icon>
                  </div>
                  <div class="info-content">
                    <label>電子郵件</label>
                    <span class="email-font">{{ user?.email }}</span>
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-icon">
                    <el-icon><School /></el-icon>
                  </div>
                  <div class="info-content">
                    <label>學校 / 單位</label>
                    <span>{{ user?.school }}</span>
                  </div>
                </div>

                <div class="info-item full-width">
                  <div class="info-icon">
                    <el-icon><PriceTag /></el-icon>
                  </div>
                  <div class="info-content">
                    <label>關注議題</label>
                    <span class="simple-text-tag">{{
                      user?.interestedIssues || '尚無關注議題'
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<style scoped>
.admin-home-container {
  max-width: 900px; /* 縮小寬度讓單欄看起來更精緻 */
  margin: 0 auto;
  padding: 2rem;
}

.welcome-banner {
  margin-bottom: 24px;
}
.welcome-banner h2 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 1.8rem;
}
.welcome-banner p {
  margin: 0;
  color: #606266;
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

/* 卡片樣式 */
.profile-card {
  background: #fff;
  overflow: hidden;
}

.profile-cover {
  height: 120px;
  background: linear-gradient(120deg, #d9ecff 0%, #ecf5ff 100%);
  position: relative;
  padding: 16px 20px;
}
.cover-content {
  display: flex;
  justify-content: space-between;
}
.cover-role {
  font-size: 0.95rem;
  color: #0052d9;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.6);
  padding: 4px 12px;
  border-radius: 6px;
  backdrop-filter: blur(4px);
}
.edit-btn-float {
  color: #606266;
  font-size: 1.1rem;
}
.edit-btn-float:hover {
  color: #409eff;
}

.profile-body {
  padding: 0 32px 32px 32px;
  position: relative;
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

.profile-header-row {
  margin-bottom: 30px;
}
.profile-identity-block {
  display: flex;
  flex-direction: column;
}
.identity-text {
  margin-top: 12px;
}
.real-name {
  font-size: 1.6rem;
  font-weight: 800;
  color: #303133;
  margin-right: 8px;
}
.nick-name {
  color: #909399;
  font-size: 1rem;
}

/* 資訊網格：改為兩欄排列，更適合管理員單一卡片的佈局 */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fcfcfc;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
}
.info-item.full-width {
  grid-column: span 2;
}

.info-icon {
  background: #ecf5ff;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #409eff; /* 改為藍色系強調管理感 */
  flex-shrink: 0;
}
.info-content {
  display: flex;
  flex-direction: column;
}
.info-content label {
  font-size: 0.8rem;
  color: #909399;
  margin-bottom: 2px;
}
.info-content span {
  font-size: 1rem;
  color: #303133;
  font-weight: 500;
}
.email-font {
  font-family: 'Roboto Mono', monospace;
}

@media (max-width: 600px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  .info-item.full-width {
    grid-column: span 1;
  }
}
</style>
