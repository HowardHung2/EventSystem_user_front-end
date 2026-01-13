<script setup lang="ts">
import { computed } from 'vue'
import Header from './Header.vue'
import Menu from './Menu.vue'
import { useLayout } from '../services/layout.service'
import type { NavItem } from '../models/layout.model'

const props = withDefaults(
  defineProps<{
    navItems: NavItem[]
    activeKey?: string
    title?: string
  }>(),
  {
    navItems: () => [],
    title: 'Event System',
  },
)

const emit = defineEmits<{
  (e: 'select', key: string): void
  (e: 'update:activeKey', key: string): void
}>()

const { isPinned, isHovering, isMobile, togglePinned, setPinned, setHovering } =
  useLayout()

const activeMenu = computed(
  () => props.activeKey ?? props.navItems[0]?.key ?? '',
)

const activeLabel = computed(() => {
  const current = props.navItems.find((item) => item.key === activeMenu.value)
  return current?.label ?? ''
})

const onSelect = (key: string) => {
  emit('select', key)
  emit('update:activeKey', key)
}

const isCollapsed = computed(() =>
  isMobile.value ? false : !isPinned.value && !isHovering.value,
)
</script>

<template>
  <el-container
    class="app-shell"
    :class="{ collapsed: isCollapsed, mobile: isMobile }"
  >
    <Menu
      :nav-items="navItems"
      :active-key="activeMenu"
      :is-collapsed="isCollapsed"
      :is-pinned="isPinned"
      :is-mobile="isMobile"
      :title="title"
      @select="onSelect"
      @toggle-pin="togglePinned"
      @hover="setHovering"
    />

    <el-container class="app-content" direction="vertical">
      <Header
        :title="activeLabel"
        :show-menu-button="false"
        @toggle-menu="togglePinned"
      >
        <template v-if="$slots['header-left']" #left>
          <slot name="header-left"></slot>
        </template>
        <template #right>
          <slot name="header-right"></slot>
        </template>
      </Header>

      <el-main class="app-main">
        <slot></slot>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.app-shell {
  height: 100vh;
  background: var(--bg-subtle);
  width: 100%;
  overflow-x: hidden;
}

.app-main {
  padding: 1.5rem;
  overflow: auto;
  min-height: 0;
}

.app-content {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  height: 100%;
}

@media (max-width: 768px) {
  .app-shell.mobile .app-main {
    padding-bottom: calc(1rem + 64px);
  }

  .app-main {
    padding: 1rem;
  }
}
</style>
