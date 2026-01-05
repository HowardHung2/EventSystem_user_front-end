<script setup lang="ts">
import { AppLayout } from '@/shared/layout'
import { ThemeSettings } from '@/shared/theme'
import { HomePage } from './home'
import { NAV_ITEMS } from './app.constants'
import { useAppRouter } from './app-router.service'

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

<style>
/* Global Variables & Base Styles managed by App or global css */
:root {
  /* Default Colors (Light Mode) */
  --bg-body: #f5f7fa;
  --bg-card: #ffffff;
  --bg-header: #ffffff;
  --bg-subtle: #f0f2f5;
  --bg-input: #ffffff;
  --text-main: #2c3e50;
  --text-header: #1a202c;
  --border-color: #e2e8f0;

  --primary-color: #da1884; /* Default Fallback */
}

/* Dark Mode Overrides */
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

/* Layout Density Overrides */
body[data-density='compact'] {
  font-size: 14px;
}
body[data-density='comfortable'] {
  font-size: 16px;
}

body {
  margin: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
    sans-serif;
  background-color: var(--bg-body);
  color: var(--text-main);
  transition:
    background-color 0.3s,
    color 0.3s;
  min-height: 100vh;
  overflow: hidden;
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

.notify-badge :deep(.el-badge__content) {
  transform: translate(8px, -4px);
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
</style>
