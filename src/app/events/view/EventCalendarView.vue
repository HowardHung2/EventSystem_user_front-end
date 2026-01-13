<!-- 行事曆 -->

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { eventService } from '../services/event.service'
import type { EventItem } from '../models/event.model'
import EventCard from '../components/EventCard.vue'

const currentDate = ref(new Date())
const events = ref<EventItem[]>([])

const isPreviewVisible = ref(false)
const selectedDateStr = ref('')
const selectedEvents = ref<EventItem[]>([])

onMounted(async () => {
  events.value = await eventService.getEvents(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
  )
})

const getEventsForDate = (date: Date) => {
  const dateStr = date.toISOString().split('T')[0]
  return events.value.filter((e) => {
    const eDate = e.start.toISOString().split('T')[0]
    return eDate === dateStr
  })
}

const handleDateClick = (date: Date) => {
  currentDate.value = date
  const evts = getEventsForDate(date)
  if (evts.length > 0) {
    selectedDateStr.value = `${date.getMonth() + 1}月${date.getDate()}日`
    selectedEvents.value = evts
    isPreviewVisible.value = true
  }
}

const changeMonth = (delta: number) => {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() + delta)
  currentDate.value = d
}

const headerDateText = computed(() => {
  const y = currentDate.value.getFullYear()
  const m = currentDate.value.getMonth() + 1
  return `${y} 年 ${m} 月`
})
</script>

<template>
  <el-config-provider :locale="zhTw">
    <div class="calendar-container">
      <el-calendar v-model="currentDate" class="custom-calendar">
        <template #header>
          <div class="calendar-header">
            <div class="header-title">{{ headerDateText }}</div>
            <div class="header-actions">
              <el-button-group>
                <el-button
                  size="small"
                  :icon="ArrowLeft"
                  @click="changeMonth(-1)"
                  >上個月</el-button
                >
                <el-button size="small" @click="currentDate = new Date()"
                  >今天</el-button
                >
                <el-button
                  size="small"
                  :icon="ArrowRight"
                  @click="changeMonth(1)"
                  >下個月</el-button
                >
              </el-button-group>
            </div>
          </div>
        </template>

        <template #date-cell="{ data }">
          <div class="date-cell" @click.stop="handleDateClick(data.date)">
            <span class="day-number">
              {{ data.day.split('-')[2] }}
            </span>

            <div class="flags">
              <span
                v-for="event in getEventsForDate(data.date)"
                :key="event.id"
                class="material-symbols-outlined flag-icon"
                :class="event.type"
              >
                flag
              </span>
            </div>
          </div>
        </template>
      </el-calendar>

      <el-dialog
        v-model="isPreviewVisible"
        :title="`${selectedDateStr} 的活動`"
        width="90%"
        class="preview-dialog"
        append-to-body
        align-center
      >
        <div class="preview-list">
          <EventCard
            v-for="event in selectedEvents"
            :key="event.id"
            :event="event"
            @click="isPreviewVisible = false"
          />
        </div>
      </el-dialog>
    </div>
  </el-config-provider>
</template>

<style scoped>
.calendar-container {
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* --- 表頭樣式 --- */
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.header-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
  white-space: nowrap; /* 強制標題不換行 */
}

/* --- 日期格子 --- */
.date-cell {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 4px;
  cursor: pointer;
}

.date-cell:hover {
  background-color: #f5f7fa;
  border-radius: 4px;
}

.day-number {
  font-weight: 500;
  color: #606266;
  margin-bottom: 2px;
  line-height: 1;
}

/* --- 旗幟設定 --- */
.flags {
  display: flex;
  flex-wrap: wrap;
  gap: 0px;
  align-content: flex-start;
}

.flag-icon {
  font-size: 1.2rem;
  line-height: 1;
  user-select: none;
}
.flag-icon.compulsory {
  color: #ef4444;
}
.flag-icon.optional {
  color: #3b82f6;
}

/* 預覽列表 */
.preview-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 60vh;
  overflow-y: auto;
  padding: 4px;
}

/* ---------------------------------------------------- */
/* 手機版 (RWD)                              */
/* ---------------------------------------------------- */
@media (max-width: 768px) {
  .calendar-container {
    padding: 0.5rem;
  }

  .calendar-header {
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }

  .header-actions {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  :deep(.el-calendar-table .el-calendar-day) {
    height: 55px !important;
    padding: 2px !important;
  }

  .day-number {
    font-size: 0.85rem;
    text-align: center;
    width: 100%;
    margin-bottom: 2px;
  }

  .flags {
    justify-content: center;
    height: 28px;
    overflow: hidden;
  }

  .flag-icon {
    font-size: 14px !important;
    margin: -1px;
  }

  :deep(.el-calendar__body) {
    padding: 0;
  }

  :deep(.preview-dialog) {
    width: 95% !important;
    border-radius: 16px;
  }
}
</style>
