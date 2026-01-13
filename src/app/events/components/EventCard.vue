<!-- 活動卡片UI -->

<script setup lang="ts">
import { computed } from 'vue'
import { Clock, Lock, Document, Medal } from '@element-plus/icons-vue'
import type { EventItem } from '../models/event.model'

const props = defineProps<{ event: EventItem }>()
const emit = defineEmits(['click'])

const isEnded = computed(() => new Date() > props.event.registrationEnd)

const getStatusLabel = (e: EventItem) => {
  if (!isEnded.value) {
    return { text: '活動進行中', class: 'in-progress' }
  } else {
    return { text: '活動已結束', class: 'ended' }
  }
}

const showEarnedHours = computed(() => {
  return isEnded.value && props.event.userIntent === 'attend'
})

const formatTimeDetail = (start: Date, end: Date) => {
  const days = ['日', '一', '二', '三', '四', '五', '六']
  const dayStr = days[start.getDay()]
  const dateStr = start.toLocaleDateString()
  const formatHM = (date: Date) => {
    let hour = date.getHours()
    const minute = date.getMinutes().toString().padStart(2, '0')
    const period = hour < 12 ? '上午' : '下午'
    hour = hour % 12 || 12
    return `${period} ${hour}:${minute}`
  }
  return `週${dayStr} ${dateStr} ${formatHM(start)} - ${formatHM(end).split(' ')[1]}`
}
</script>

<template>
  <div class="event-item-wrapper">
    <div class="period-badge">
      報名截止: {{ event.registrationEnd.toLocaleDateString() }}
    </div>

    <div
      class="event-card"
      :class="[event.type, { 'is-ended': isEnded }]"
      @click="emit('click', event.id)"
    >
      <div class="top-bar"></div>

      <div class="card-content">
        <div class="header-row">
          <div class="title-section">
            <h3>{{ event.title }}</h3>
          </div>

          <div class="status-section">
            <div class="status-badge" :class="getStatusLabel(event).class">
              {{ getStatusLabel(event).text }}
            </div>

            <div v-if="showEarnedHours" class="earned-hours-tag">
              <span class="hours-content"
                >核發時數 {{ event.hours || 0 }} 小時</span
              >
            </div>
          </div>
        </div>

        <div class="info-row time-row">
          <el-icon><Clock /></el-icon>
          <span>{{ formatTimeDetail(event.start, event.end) }}</span>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <el-icon><Lock /></el-icon>
            <span>{{
              event.type === 'compulsory' ? '必要參加' : '自由參加'
            }}</span>
          </div>

          <div class="info-item status-item">
            <template v-if="event.status === 'pending'">
              <el-icon><Document /></el-icon>
              <span>尚未回覆</span>
            </template>
            <template v-else>
              <span
                v-if="event.userIntent === 'attend'"
                class="status-pill green"
                >參加</span
              >
              <span
                v-else-if="event.userIntent === 'leave'"
                class="status-pill orange"
                >請假</span
              >
              <span
                v-else-if="event.userIntent === 'skip'"
                class="status-pill gray"
                >不參加</span
              >
              <span
                v-else-if="event.status === 'absent'"
                class="status-pill red"
                >缺席</span
              >
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.event-item-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 1.2rem;
}

.status-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px; /* 增加標籤之間的垂直間距，避免黏在一起 */
  min-width: 110px;
}

/* 奶油色調時數標籤樣式 */
.earned-hours-tag {
  background-color: #fff9eb; /* 奶油色背景 */
  border: 1px solid #ffe7a5; /* 淺金邊框 */
  padding: 4px 14px;
  border-radius: 20px; /* 圓角膠囊形狀 */
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.hours-content {
  color: #d97706; /* 深橘金色文字 */
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.03em;
}

/* 基礎樣式 */
.period-badge {
  background: #ffa726;
  color: #fff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  margin-bottom: 8px;
  font-weight: 500;
  width: fit-content;
}

.event-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
  width: 100%;
  transition: all 0.25s ease;
  cursor: pointer;
}
.event-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.top-bar {
  height: 6px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.event-card.compulsory .top-bar {
  background: #ef4444;
}
.event-card.optional .top-bar {
  background: #3b82f6;
}

.card-content {
  padding: 1.5rem;
  padding-top: 1.8rem;
}

h3 {
  margin: 0;
  font-size: 1.35rem;
  color: #1a1a1a;
  font-weight: 700;
  line-height: 1.4;
}

.status-badge {
  font-size: 0.8rem;
  padding: 3px 12px;
  border-radius: 8px;
  white-space: nowrap;
  font-weight: 500;
}
.status-badge.in-progress {
  color: #409eff;
  background: #ecf5ff;
  border: 1px solid #d9ecff;
}
.status-badge.ended {
  color: #909399;
  background: #f4f4f5;
  border: 1px solid #e9e9eb;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  margin-bottom: 0.8rem;
  font-size: 0.95rem;
}
.time-row {
  color: #555;
  margin-bottom: 1.2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  align-items: center;
}
.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #555;
}

.status-item {
  justify-content: flex-end;
}
.status-pill {
  padding: 4px 16px;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: bold;
  color: #fff;
}
.status-pill.green {
  background-color: #67c23a;
}
.status-pill.orange {
  background-color: #e6a23c;
}
.status-pill.red {
  background-color: #f56c6c;
}
.status-pill.gray {
  background-color: #909399;
}

@media (max-width: 768px) {
  .header-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .status-section {
    align-items: flex-start;
    flex-direction: row;
    gap: 10px;
    width: 100%;
    margin-top: 4px;
  }
  .earned-hours-tag {
    padding: 2px 10px;
  }
}
</style>
