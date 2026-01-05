<script setup lang="ts">
import { AppLayout } from '@/shared/layout'
import { ThemeSettings } from '@/shared/theme'
import { HomePage } from '@/app/home'
import { NAV_ITEMS } from '../models/app.constants'
import { useAppRouter } from '../services/app-router.service'

const routes = {
  '/': HomePage,
  '/brochure': HomePage,
  '/events': HomePage,
  '/contact': HomePage,
  '/theme': ThemeSettings,
}

const { activeRoute, activeView, navigate } = useAppRouter(routes)
const userDisplayName = '陌生人'
</script>

<template>
  <AppLayout
    :nav-items="NAV_ITEMS"
    :active-key="activeRoute"
    title="EventSystem"
    @select="navigate"
  >
    <template #header-right>
      <div class="header-actions">
        <el-dropdown trigger="click">
          <div class="avatar-trigger">
            <el-avatar :size="30" class="user-avatar">
              <span class="material-symbols-outlined" aria-hidden="true">
                person
              </span>
            </el-avatar>
            <span class="user-name">{{ userDisplayName }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>Profile</el-dropdown-item>
              <el-dropdown-item>Account settings</el-dropdown-item>
              <el-dropdown-item divided>Sign out</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </template>

    <component :is="activeView" />
  </AppLayout>
</template>

<style scoped>
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
  font-weight: 600;
}

.user-avatar :deep(.material-symbols-outlined) {
  font-size: 1.15rem;
}

.user-name {
  font-size: 0.9rem;
  color: var(--text-header);
}

@media (max-width: 768px) {
  .header-actions {
    gap: 0.5rem;
  }

  .user-name {
    display: none;
  }
}
</style>
