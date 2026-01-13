<!-- 篩選器UI -->

<script setup lang="ts">
import { Search, Filter } from '@element-plus/icons-vue'

defineProps<{
  keyword: string
  dateRange: [Date, Date] | null
  intent: string
  timeStatus: string
}>()

const emit = defineEmits([
  'update:keyword',
  'update:dateRange',
  'update:intent',
  'update:timeStatus',
])
</script>

<template>
  <div class="filter-bar">
    <div class="filter-grid">
      <div class="filter-item item-left">
        <el-input
          :model-value="keyword"
          @update:model-value="emit('update:keyword', $event)"
          placeholder="搜尋活動名稱..."
          :prefix-icon="Search"
          clearable
          class="full-width"
        />
      </div>

      <div class="filter-item item-right">
        <el-select
          :model-value="intent"
          @update:model-value="emit('update:intent', $event)"
          placeholder="參加狀態"
          class="full-width"
        >
          <template #prefix
            ><el-icon><Filter /></el-icon
          ></template>
          <el-option label="所有狀態" value="all" />
          <el-option label="參加" value="attend" />
          <el-option label="請假" value="leave" />
          <el-option label="不參加" value="skip" />
          <el-option label="缺席" value="absent" />
        </el-select>
      </div>

      <div class="filter-item item-left">
        <el-date-picker
          :model-value="dateRange"
          @update:model-value="emit('update:dateRange', $event)"
          type="daterange"
          range-separator="至"
          start-placeholder="開始日期"
          end-placeholder="結束日期"
          class="full-width mobile-date-picker"
        />
      </div>

      <div class="filter-item item-right radio-container">
        <el-radio-group
          :model-value="timeStatus"
          @update:model-value="emit('update:timeStatus', $event)"
          class="custom-radio-group"
        >
          <el-radio-button value="future">未結束</el-radio-button>
          <el-radio-button value="past">已結束</el-radio-button>
          <el-radio-button value="all">全部</el-radio-button>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 樣式部分保持不變 */
.filter-bar {
  max-width: 800px;
  width: 100%;
  margin: 0 auto 1.5rem auto;
  background: #fff;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
  align-items: center;
}

.full-width {
  width: 100% !important;
}
:deep(.el-select),
:deep(.el-input),
:deep(.el-date-editor) {
  width: 100%;
}

.item-left {
  grid-column: span 7;
}
.item-right {
  grid-column: span 5;
}
.radio-container {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .filter-bar {
    padding: 1rem;
    width: 100%;
  }

  .filter-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .item-left,
  .item-right {
    width: 100%;
  }

  .radio-container {
    justify-content: stretch;
  }
  .custom-radio-group {
    display: flex;
    width: 100%;
  }
  :deep(.el-radio-group .el-radio-button) {
    flex: 1;
    text-align: center;
  }
  :deep(.el-radio-button__inner) {
    width: 100%;
    padding: 10px 0;
  }

  :deep(.mobile-date-picker.el-date-editor--daterange.el-input__wrapper) {
    padding: 0 4px !important;
    width: 100%;
    box-sizing: border-box;
  }

  :deep(.mobile-date-picker .el-input__icon.el-range__icon) {
    display: none;
  }

  :deep(.mobile-date-picker .el-range-separator) {
    padding: 0 2px;
    width: auto;
    flex: 0 0 auto;
    font-size: 12px;
  }

  :deep(.mobile-date-picker .el-range-input) {
    font-size: 13px;
    width: 42%;
    text-align: center;
    padding: 0;
  }

  :deep(.mobile-date-picker .el-input__icon.el-range__close-icon) {
    position: absolute;
    right: 2px;
    display: none;
  }
  :deep(.mobile-date-picker:hover .el-input__icon.el-range__close-icon) {
    display: block;
    background: #fff;
  }
}
</style>
