<!-- 登入頁面UI -->

<script setup lang="ts">
import { ref } from 'vue'
import { User, Lock, Warning, Monitor } from '@element-plus/icons-vue' // 新增 Monitor 作為 Logo 圖示
import { authService } from '../services/auth.service'

const emit = defineEmits(['login-success'])

const form = ref({
  username: '',
  password: '',
})

const isLoading = ref(false)
const errorMessage = ref('')
const rememberMe = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    await authService.login({
      username: form.value.username,
      password: form.value.password,
    })
    emit('login-success')
  } catch (error: any) {
    console.error(error)
    errorMessage.value = '登入失敗：請確認帳號密碼'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-content fade-in-up">
      <div class="login-header">
        <div class="logo-box">
          <el-icon :size="32" color="#409eff"><Monitor /></el-icon>
        </div>
        <h1 class="app-title">TYCR System</h1>
        <p class="app-subtitle">活動時數管理平台</p>
      </div>

      <div class="login-card">
        <h3 class="login-welcome">歡迎回來</h3>

        <el-form :model="form" @submit.prevent="handleLogin" class="login-form">
          <el-form-item class="custom-input-item">
            <el-input
              v-model="form.username"
              placeholder="帳號"
              size="large"
              :prefix-icon="User"
              class="minimal-input"
            />
          </el-form-item>

          <el-form-item class="custom-input-item">
            <el-input
              v-model="form.password"
              placeholder="密碼"
              type="password"
              show-password
              size="large"
              :prefix-icon="Lock"
              class="minimal-input"
            />
          </el-form-item>

          <div v-if="errorMessage" class="error-msg">
            <el-icon><Warning /></el-icon> {{ errorMessage }}
          </div>

          <div class="form-actions">
            <el-checkbox v-model="rememberMe" label="記住我" size="large" />
            <el-link type="primary" underline="never" class="forgot-link"
              >忘記密碼？</el-link
            >
          </div>

          <el-button
            type="primary"
            class="submit-btn"
            size="large"
            :loading="isLoading"
            @click="handleLogin"
            round
          >
            {{ isLoading ? '登入中...' : '登入' }}
          </el-button>
        </el-form>
      </div>

      <div class="login-footer">© 2026 TYCR System. All Rights Reserved.</div>
    </div>
  </div>
</template>

<style scoped>
/* 1. 背景：使用 Dashboard 風格的淡藍色漸層，營造統一感 */
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #d9ecff 0%, #ecf5ff 100%);
  position: relative;
  overflow: hidden;
}

/* 裝飾背景圓 (選用，增加層次感) */
.login-container::before {
  content: '';
  position: absolute;
  top: -10%;
  right: -5%;
  width: 400px;
  height: 400px;
  background: rgba(64, 158, 255, 0.05);
  border-radius: 50%;
  filter: blur(80px);
}
.login-container::after {
  content: '';
  position: absolute;
  bottom: -10%;
  left: -5%;
  width: 300px;
  height: 300px;
  background: rgba(64, 158, 255, 0.08);
  border-radius: 50%;
  filter: blur(60px);
}

.login-content {
  width: 100%;
  max-width: 420px;
  padding: 20px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 標題區 */
.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo-box {
  width: 60px;
  height: 60px;
  background: #fff;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 16px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15); /* 輕微藍色陰影 */
}

.app-title {
  font-size: 1.8rem;
  color: #303133;
  margin: 0;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.app-subtitle {
  margin-top: 8px;
  color: #606266;
  font-size: 1rem;
  font-weight: 500;
}

/* 卡片區：純白、乾淨、高質感 */
.login-card {
  background: #fff;
  width: 100%;
  padding: 40px 32px;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04); /* 更加柔和的陰影 */
  transition: transform 0.3s ease;
}

.login-card:hover {
  transform: translateY(-2px); /* 懸浮微動 */
}

.login-welcome {
  margin: 0 0 24px 0;
  font-size: 1.2rem;
  color: #303133;
  font-weight: 600;
  text-align: center;
}

/* 輸入框優化 */
.custom-input-item {
  margin-bottom: 20px;
}

/* 覆蓋 Element Plus Input 樣式，使其更簡約 */
:deep(.minimal-input .el-input__wrapper) {
  background-color: #f5f7fa; /* 淺灰底色，不刺眼 */
  box-shadow: none !important;
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 8px 15px;
  transition: all 0.3s;
}

:deep(.minimal-input .el-input__wrapper:hover),
:deep(.minimal-input .el-input__wrapper.is-focus) {
  background-color: #fff;
  border-color: #409eff; /* 聚焦時顯示主色邊框 */
  box-shadow: 0 0 0 4px rgba(64, 158, 255, 0.1) !important;
}

/* 按鈕區 */
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.submit-btn {
  width: 100%;
  font-weight: 600;
  height: 48px;
  border-radius: 12px;
  font-size: 1rem;
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.3); /* 藍色光暈陰影 */
  transition: all 0.3s;
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(64, 158, 255, 0.4);
}

/* 錯誤訊息 */
.error-msg {
  color: #f56c6c;
  font-size: 0.9rem;
  margin-bottom: 16px;
  background: #fef0f0;
  padding: 8px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 頁尾 */
.login-footer {
  margin-top: 30px;
  color: #909399;
  font-size: 0.8rem;
  opacity: 0.8;
}

/* 進場動畫 */
.fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
