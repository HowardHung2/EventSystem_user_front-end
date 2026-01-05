<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    showMenuButton?: boolean
  }>(),
  {
    title: '',
    showMenuButton: false,
  },
)

const emit = defineEmits<{
  (e: 'toggle-menu'): void
}>()
</script>

<template>
  <el-header class="app-header">
    <div class="header-left">
      <slot name="left">
        <div class="title-row">
          <el-button
            v-if="showMenuButton"
            class="menu-btn"
            text
            @click="emit('toggle-menu')"
          >
            <span class="material-symbols-outlined" aria-hidden="true">
              menu
            </span>
          </el-button>
          <h1 class="page-title">{{ title }}</h1>
        </div>
      </slot>
    </div>
    <div class="header-right">
      <slot name="right"></slot>
    </div>
  </el-header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 65px;
  padding: 0 1rem;
  box-sizing: border-box;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-header);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.title-row {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.menu-btn {
  padding: 0;
  width: 36px;
  height: 36px;
}

.page-title {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-header);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
