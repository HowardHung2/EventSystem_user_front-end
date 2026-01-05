<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
  }>(),
  {
    title: '',
  },
)
</script>

<template>
  <el-header class="app-header">
    <div class="header-left">
      <slot name="left">
        <h1 class="page-title">{{ title }}</h1>
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
