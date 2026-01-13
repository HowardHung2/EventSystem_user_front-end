<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// --- Shared (共用模組) ---
import { AppLayout } from '@/shared/layout'
import { ThemeSettings } from '@/shared/theme'

// --- Core (核心模組)  ---
import { NAV_ITEMS } from '@/app/core/constants/app.constants'
import { useAppRouter } from '@/app/core/services/app-router.service'

// --- Features (功能模組) ---
import HomePage from '@/app/home/view/HomePage.vue'
import ProfilePage from '@/app/profile/view/ProfilePage.vue'
import LoginPage from '@/shared/auth/view/LoginPage.vue'
import EventListView from '@/app/events/view/EventListView.vue'
import EventRegister from '@/app/events/view/EventRegisterPage.vue'
import ContactPage from '@/app/contact/view/ContactPage.vue'

// --- Services (服務) ---
import { authService } from '@/shared/auth/services/auth.service'
import { userService } from '@/app/profile/services/user.service'

// 路由設定
const routes = {
  '/': HomePage,
  '/brochure': HomePage,
  '/contact': ContactPage,
  '/theme': ThemeSettings,
  '/login': LoginPage,
  '/profile': ProfilePage,
  '/events': EventListView,
  '/event-register': EventRegister,
}

// 使用 Core Service 初始化路由
const { activeRoute, activeView, navigate } = useAppRouter(routes)

const handleMenuSelect = (key: string) => {
  if (key === '/brochure') {
    window.open('/經濟學實務學習歷程.pdf', '_blank')
    return
  }
  navigate(key)
}

const showLoginPage = computed(() => {
  return activeRoute.value === '/login' || !authService.isLoggedIn()
})

const userDisplayName = ref('')

const fetchUserProfile = async () => {
  try {
    if (authService.isLoggedIn()) {
      const profile = await userService.getProfile()
      userDisplayName.value =
        profile.nickname || profile.name || profile.username
    }
  } catch (error) {
    console.error('無法取得使用者名稱', error)
    userDisplayName.value = '使用者'
  }
}

const onLoginSuccess = async () => {
  navigate('/')
  await fetchUserProfile()
}

const onLogout = () => {
  authService.logout()
  navigate('/login')
}

onMounted(async () => {
  if (!authService.isLoggedIn()) {
    navigate('/login')
  } else {
    await fetchUserProfile()
  }
})
</script>

<template>
  <LoginPage v-if="showLoginPage" @login-success="onLoginSuccess" />

  <AppLayout
    v-else
    :nav-items="NAV_ITEMS"
    :active-key="activeRoute"
    title="EventSystem"
    @select="handleMenuSelect"
  >
    <template #header-right>
      <div class="header-actions">
        <el-dropdown trigger="click">
          <div class="avatar-trigger">
            <el-avatar :size="30" class="user-avatar">
              <span class="material-symbols-outlined">person</span>
            </el-avatar>
            <span class="user-name">{{ userDisplayName }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="navigate('/profile')"
                >個人設定</el-dropdown-item
              >
              <el-dropdown-item divided @click="onLogout"
                >登出</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>

    <keep-alive :include="['EventListView']">
      <component :is="activeView" />
    </keep-alive>
  </AppLayout>
</template>

<style>
:root {
  --bg-body: #f5f7fa;
  --bg-card: #ffffff;
  --bg-header: #ffffff;
  --bg-subtle: #f0f2f5;
  --bg-input: #ffffff;
  --text-main: #2c3e50;
  --text-header: #1a202c;
  --border-color: #e2e8f0;
  --primary-color: #da1884;
}

body.dark-mode {
  --bg-body: #1a202c;
  --bg-card: #2d3748;
  --bg-header: #2d3748;
  --bg-subtle: #171923;
  --bg-input: #4a5568;
  --text-main: #e2e8f0;
  --text-header: #f7fafc;
  --border-color: #4a5568;
}

body {
  margin: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--bg-body);
  color: var(--text-main);
  transition:
    background-color 0.3s,
    color 0.3s;
  min-height: 100vh;
}

html,
body,
#app {
  height: 100%;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--text-main);
}

.user-avatar {
  background: var(--primary-color);
  color: #fff;
  font-weight: bold;
}

.user-name {
  font-size: 0.9rem;
  color: var(--text-header);
}

@media (max-width: 768px) {
  .user-name {
    display: none;
  }
}
</style>
