<script setup lang="ts">
import type { NavItem } from '../models/layout.model'

withDefaults(
  defineProps<{
    navItems: NavItem[]
    activeKey: string
    isCollapsed: boolean
    isPinned: boolean
    title?: string
  }>(),
  {
    navItems: () => [],
    title: 'Event System',
  },
)

const emit = defineEmits<{
  (e: 'select', key: string): void
  (e: 'toggle-pin'): void
  (e: 'hover', value: boolean): void
}>()

const onTogglePin = () => {
  emit('toggle-pin')
}
</script>

<template>
  <el-aside
    class="app-aside"
    :class="{ collapsed: isCollapsed }"
    :width="isCollapsed ? '72px' : '220px'"
    @mouseenter="emit('hover', true)"
    @mouseleave="emit('hover', false)"
  >
    <div class="aside-top">
      <div class="brand" :title="title" @click="emit('select', '/')">
        <span class="brand-icon">ES</span>
        <span v-if="!isCollapsed" class="brand-text">{{ title }}</span>
      </div>
      <el-button class="pin-btn" text @click="onTogglePin">
        <span
          class="material-symbols-outlined pin-icon"
          :class="{ pinned: isPinned }"
          aria-hidden="true"
        >
          push_pin
        </span>
      </el-button>
    </div>

    <el-menu
      class="aside-menu"
      :default-active="activeKey"
      :collapse="isCollapsed"
      :collapse-transition="false"
      @select="(key: string) => emit('select', key)"
    >
      <el-menu-item
        v-for="item in navItems"
        :key="item.key"
        :index="item.key"
        :disabled="item.disabled"
      >
        <span
          v-if="item.icon"
          class="material-symbols-outlined menu-icon"
          aria-hidden="true"
        >
          {{ item.icon }}
        </span>
        <template #title>{{ item.label }}</template>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<style scoped>
.app-aside {
  border-right: 1px solid var(--border-color);
  background: var(--bg-card);
  transition: width 0.2s ease;
  overflow-x: hidden;
}

.aside-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.app-aside.collapsed .aside-top {
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  height: 64px;
  padding: 0;
}

.app-aside.collapsed .brand {
  justify-content: center;
}

.app-aside.collapsed .pin-btn {
  display: none;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.brand:hover .brand-text {
  color: var(--primary-color);
}

.brand-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--primary-color);
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
}

.brand-text {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-header);
}

.pin-btn {
  font-weight: 600;
}

.pin-icon {
  font-size: 1.1rem;
  transform: rotate(-45deg);
}

.pin-icon.pinned {
  transform: rotate(0deg);
}

.aside-menu {
  border-right: none;
}

.app-aside :deep(.el-menu) {
  --el-menu-bg-color: var(--bg-card);
  --el-menu-text-color: var(--text-main);
  --el-menu-hover-bg-color: var(--bg-subtle);
  --el-menu-active-color: var(--primary-color);
  background: var(--bg-card);
}

.app-aside :deep(.el-menu-item.is-active) {
  background: var(--bg-subtle);
}

.menu-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-right: 0.5rem;
  font-size: 1.1rem;
  color: var(--text-main);
}

.app-aside :deep(.el-menu-item.is-active .menu-icon) {
  color: var(--primary-color);
}

.app-aside.collapsed .menu-icon {
  margin-right: 0;
}

.app-aside.collapsed :deep(.el-menu--collapse) {
  width: 100%;
}

@media (max-width: 768px) {
  .app-aside {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 200;
    box-shadow: 8px 0 16px rgba(0, 0, 0, 0.12);
    transform: translateX(0);
  }

  .app-aside.collapsed {
    transform: translateX(-100%);
  }

  .app-aside.collapsed .pin-btn {
    display: inline-flex;
  }
}
</style>
