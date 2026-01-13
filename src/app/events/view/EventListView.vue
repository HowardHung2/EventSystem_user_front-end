<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Loading, Calendar, List } from '@element-plus/icons-vue'
import { eventService } from '../services/event.service'
import { useAppRouter } from '@/app/core/services/app-router.service'
import type { EventItem } from '../models/event.model'
import EventCard from '../components/EventCard.vue'
import EventFilterBar from '../components/EventFilterBar.vue'
import EventCalendarView from './EventCalendarView.vue'
import { useEventFiltering } from '../composables/useEventFiltering'

// [修改] 優先從 localStorage 讀取上次視圖，若無則預設為 'calendar'
const viewMode = ref<'calendar' | 'list'>(
  (localStorage.getItem('event_view_mode') as any) || 'calendar',
)
const activeListTab = ref<'upcoming' | 'history'>('upcoming')
const allEvents = ref<EventItem[]>([])
const isLoading = ref(false)
const { navigate } = useAppRouter({})

const {
  searchKeyword,
  searchDateRange,
  filterIntent,
  filterTimeStatus,
  filteredEvents,
  resetFilters,
} = useEventFiltering(allEvents, activeListTab)

// [新增] 監聽視圖切換並儲存
watch(viewMode, (newMode) => {
  localStorage.setItem('event_view_mode', newMode)
})

watch(activeListTab, (newTab) => {
  if (newTab === 'upcoming') {
    resetFilters()
  }
})

const goToRegister = (eventId: string) => {
  eventService.setSelectedEvent(eventId)
  navigate('/event-register')
}

onMounted(async () => {
  isLoading.value = true
  // 這裡假設抓取 2026 年的資料
  allEvents.value = await eventService.getEvents(2026, 1)
  isLoading.value = false
})
</script>

<template>
  <div class="page-container">
    <div class="top-switcher-container">
      <div class="view-switcher">
        <div
          class="switch-item"
          :class="{ active: viewMode === 'calendar' }"
          @click="viewMode = 'calendar'"
        >
          <el-icon><Calendar /></el-icon>
          <span>行事曆</span>
        </div>
        <div
          class="switch-item"
          :class="{ active: viewMode === 'list' }"
          @click="viewMode = 'list'"
        >
          <el-icon><List /></el-icon>
          <span>列表</span>
        </div>
      </div>
    </div>

    <div class="main-content">
      <transition name="el-fade-in-linear" mode="out-in">
        <div
          v-if="viewMode === 'calendar'"
          key="calendar"
          class="calendar-wrapper"
        >
          <EventCalendarView />
        </div>

        <div v-else key="list" class="list-view-wrapper">
          <div class="sub-tabs-container">
            <button
              class="sub-tab-btn"
              :class="{ 'is-active': activeListTab === 'upcoming' }"
              @click="activeListTab = 'upcoming'"
            >
              待處理
            </button>
            <button
              class="sub-tab-btn"
              :class="{ 'is-active': activeListTab === 'history' }"
              @click="activeListTab = 'history'"
            >
              歷史紀錄
            </button>
          </div>

          <transition name="el-zoom-in-top">
            <EventFilterBar
              v-if="activeListTab === 'history'"
              v-model:keyword="searchKeyword"
              v-model:dateRange="searchDateRange"
              v-model:intent="filterIntent"
              v-model:timeStatus="filterTimeStatus"
            />
          </transition>

          <div v-if="isLoading" class="loading-state">
            <el-icon class="is-loading"><Loading /></el-icon> 資料載入中...
          </div>

          <div v-else class="event-list">
            <div v-if="filteredEvents.length === 0" class="empty-state">
              <el-empty
                :description="
                  activeListTab === 'history'
                    ? '沒有符合篩選條件的活動'
                    : '目前沒有待處理事項'
                "
              />
            </div>

            <EventCard
              v-for="event in filteredEvents"
              :key="event.id"
              :event="event"
              @click="goToRegister"
            />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  background-color: #f5f7fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-switcher-container {
  padding: 1.5rem 0 1rem 0;
  display: flex;
  justify-content: center;
}

.view-switcher {
  background-color: #eaecf0;
  padding: 4px;
  border-radius: 12px;
  display: flex;
  gap: 4px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06);
}

.switch-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 24px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #667085;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.switch-item:hover {
  color: #333;
}

.switch-item.active {
  background-color: #ffffff;
  color: #409eff;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.06);
}

.main-content {
  padding: 0 1.5rem 1.5rem 1.5rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  box-sizing: border-box;
}

.sub-tabs-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.sub-tab-btn {
  padding: 10px 0;
  width: 140px;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
  background: #ebf5ff;
  color: #606266;
}

.sub-tab-btn.is-active {
  background: #1976d2;
  color: #fff;
  box-shadow: 0 4px 10px rgba(25, 118, 210, 0.3);
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.loading-state {
  text-align: center;
  padding: 2rem;
  color: #909399;
}
.empty-state {
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
}

@media (max-width: 768px) {
  .main-content {
    padding: 0 1rem 1rem 1rem;
  }

  .sub-tab-btn {
    width: 48%;
    font-size: 1rem;
  }

  .switch-item {
    padding: 8px 16px;
  }
}
</style>
