<!-- 註冊表單 -->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useAppRouter } from '@/app/core/services/app-router.service'
import { eventService } from '../services/event.service'
import { userService } from '@/app/profile/services/user.service'
import type { EventItem, UserIntent } from '../models/event.model'
import { Loading } from '@element-plus/icons-vue'

// [修改] 解構出 goBack 方法
const { navigate, goBack } = useAppRouter({})
const isLoading = ref(true)
const eventData = ref<EventItem | undefined>(undefined)

const isCompulsory = computed(() => eventData.value?.type === 'compulsory')
const isReadOnly = computed(() => {
  if (!eventData.value) return true
  return new Date() > eventData.value.registrationEnd
})

const form = ref({
  intent: 'attend' as 'attend' | 'leave' | 'skip',
  // --- 自由參加 ---
  participationType: 'full',
  partialTime: [] as any,

  // --- 必要參加 ---
  leaveCategory: '',
  leaveNote: '',
  meal: '',
  dietary: '',
  autoImportDietary: false,
})

const leaveOptions = [
  '事假',
  '病假',
  '喪假',
  '生理假',
  '課業假',
  '家庭假',
  '身心調適假',
]

onMounted(async () => {
  isLoading.value = true
  try {
    eventData.value = await eventService.getCurrentEvent()
    if (!eventData.value) {
      ElMessage.warning('找不到活動資料，返回列表')
      // [修改] 找不到資料時也使用 goBack，若無歷史紀錄會由 service 導向 /events
      goBack()
      return
    }

    if (eventData.value.userIntent) {
      form.value.intent = eventData.value.userIntent as any
      if (form.value.intent === 'attend') {
        form.value.meal = 'meat'
      } else if (form.value.intent === 'leave') {
        form.value.leaveCategory = '事假'
      }
    }
  } finally {
    isLoading.value = false
  }
})

const formatDateTime = (d: Date) => {
  return d.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

const handleAutoImportChange = async (val: boolean) => {
  if (val) {
    const userProfile = await userService.getProfile()
    const combined = `${userProfile.dietaryPreference}。${userProfile.dietaryNote || ''}`
    form.value.dietary = combined
  } else {
    form.value.dietary = ''
  }
}

// 送出表單
const handleSubmit = async () => {
  if (isReadOnly.value) return // 防呆

  // 1. 驗證: 參加必須選餐食
  if (form.value.intent === 'attend') {
    if (!form.value.meal) {
      ElMessage.error('請選擇供應餐食選項')
      return
    }
  }

  // 2. 驗證: 請假必須選原因
  if (isCompulsory.value && form.value.intent === 'leave') {
    if (!form.value.leaveCategory) {
      ElMessage.error('請選擇請假原因')
      return
    }
  }

  if (eventData.value) {
    let finalIntent = form.value.intent as UserIntent
    if (!isCompulsory.value && form.value.intent === 'skip')
      finalIntent = 'skip'

    await eventService.submitRegistration(
      eventData.value.id,
      finalIntent,
      form.value,
    )

    ElMessage.success(
      eventData.value.status === 'pending' ? '報名成功！' : '修改成功！',
    )

    // [修改] 成功後回到上一頁，保留原本列表的搜尋/過濾狀態
    goBack()
  }
}
</script>

<template>
  <div class="register-page">
    <div class="page-header">
      <el-button link @click="goBack()">
        <span class="material-symbols-outlined">arrow_back</span> 返回
      </el-button>
      <h2>
        {{
          isReadOnly
            ? '檢視報名資料'
            : isCompulsory
              ? '必要參加活動'
              : '自由參加活動'
        }}
      </h2>
    </div>

    <div v-if="isLoading" class="loading-state">
      <el-icon class="is-loading"><Loading /></el-icon> 讀取中...
    </div>

    <div v-else-if="eventData" class="form-container">
      <el-alert
        v-if="isReadOnly"
        title="報名期間已截止，僅供檢視"
        type="info"
        show-icon
        :closable="false"
        style="margin-bottom: 20px"
      />

      <div class="info-card">
        <div class="field-group">
          <label>活動名稱</label>
          <div class="read-only-box highlight">{{ eventData.title }}</div>
        </div>
        <div class="field-group">
          <label>活動內容</label>
          <div class="read-only-box content-box">
            {{ eventData.content || '無詳細內容' }}
          </div>
        </div>
        <div class="field-group">
          <label>活動核發時數</label>
          <div class="read-only-box hours-box">
            <span class="material-symbols-outlined hour-icon">schedule</span>
            <span class="hour-text">{{ eventData.hours || 0 }} 小時</span>
          </div>
        </div>
        <div class="field-group">
          <label>活動時間</label>
          <div class="time-range-display">
            <div class="time-box">
              <span class="material-symbols-outlined icon">calendar_today</span>
              <span>{{ formatDateTime(eventData.start) }}</span>
            </div>
            <span class="separator">至</span>
            <div class="time-box">
              <span class="material-symbols-outlined icon">calendar_today</span>
              <span>{{ formatDateTime(eventData.end) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="input-card">
        <el-form
          :model="form"
          label-position="top"
          size="large"
          :disabled="isReadOnly"
        >
          <el-form-item label="參與意願" required>
            <el-radio-group v-model="form.intent">
              <el-radio value="attend" border>參加</el-radio>
              <el-radio v-if="isCompulsory" value="leave" border>請假</el-radio>
              <el-radio v-else value="skip" border>不參加</el-radio>
            </el-radio-group>
          </el-form-item>

          <template v-if="form.intent === 'attend'">
            <template v-if="!isCompulsory">
              <el-form-item label="參與時段">
                <el-radio-group v-model="form.participationType">
                  <el-radio value="full">全程參與</el-radio>
                  <el-radio value="partial">部分參與 (需審核)</el-radio>
                </el-radio-group>
              </el-form-item>
              <div
                v-if="form.participationType === 'partial'"
                class="sub-field fade-in"
              >
                <el-form-item label="請選擇您可參與的時段">
                  <el-time-picker
                    v-model="form.partialTime"
                    is-range
                    range-separator="至"
                    start-placeholder="開始時間"
                    end-placeholder="結束時間"
                    format="HH:mm"
                    style="width: 100%"
                  />
                </el-form-item>
              </div>
            </template>

            <el-form-item label="供應餐食" required>
              <el-select
                v-model="form.meal"
                placeholder="請選擇餐點需求"
                style="width: 100%"
              >
                <el-option label="葷食便當" value="meat" />
                <el-option label="素食便當" value="veg" />
                <el-option label="不用餐" value="none" />
              </el-select>
            </el-form-item>

            <div class="dietary-row">
              <el-form-item
                label="飲食忌口 / 特殊需求"
                required
                style="flex: 1"
              >
                <el-input
                  v-model="form.dietary"
                  placeholder="例如：對蝦蟹過敏、不吃牛..."
                />
              </el-form-item>
              <div class="auto-import">
                <span class="label-text">自動帶入飲食習慣</span>
                <el-switch
                  v-model="form.autoImportDietary"
                  @change="handleAutoImportChange"
                />
              </div>
            </div>
          </template>

          <template v-else-if="isCompulsory && form.intent === 'leave'">
            <div class="leave-form-section fade-in">
              <el-form-item label="請假原因 (單選)" required>
                <el-radio-group v-model="form.leaveCategory">
                  <div class="options-grid">
                    <el-radio
                      v-for="opt in leaveOptions"
                      :key="opt"
                      :value="opt"
                      border
                    >
                      {{ opt }}
                    </el-radio>
                  </div>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="詳細說明">
                <el-input
                  v-model="form.leaveNote"
                  type="textarea"
                  placeholder="請輸入請假詳細原因..."
                  :rows="3"
                />
              </el-form-item>
            </div>
          </template>

          <template v-else>
            <el-form-item label="不參加原因 (選填)">
              <el-input
                type="textarea"
                placeholder="若方便請告知原因..."
                :rows="3"
              />
            </el-form-item>
          </template>

          <div class="form-actions">
            <el-button size="large" @click="goBack()">
              {{ isReadOnly ? '返回' : '取消' }}
            </el-button>
            <el-button
              v-if="!isReadOnly"
              type="primary"
              size="large"
              class="submit-btn"
              @click="handleSubmit"
            >
              確認送出
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 樣式保持原樣 */
.register-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  padding-bottom: 4rem;
}

.hours-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  color: #333;
}

.hour-icon {
  font-size: 1.25rem;
  display: flex;
  align-items: center;
}

.hour-text {
  line-height: 1;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.page-header h2 {
  margin: 0;
  color: #333;
}

.info-card,
.input-card {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.field-group {
  margin-bottom: 1.2rem;
}
.field-group label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.read-only-box {
  background: #f8fafc;
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  color: #333;
  font-size: 1rem;
}
.read-only-box.highlight {
  font-weight: bold;
  color: #2c3e50;
}
.content-box {
  min-height: 80px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.time-range-display {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.time-box {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 8px 12px;
  color: #606266;
  font-size: 1rem;
  flex: 1;
  min-width: 220px;
  height: 40px;
  box-sizing: border-box;
}
.time-box .icon {
  font-size: 1.2rem;
  margin-right: 8px;
  color: #909399;
  display: flex;
}
.separator {
  color: #909399;
  font-weight: bold;
}

.sub-field,
.leave-form-section {
  background: #fdfdfd;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px dashed #dcdfe6;
  margin-bottom: 1.5rem;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  width: 100%;
}
:deep(.el-radio.is-bordered) {
  margin-right: 0;
  width: 100%;
}

.dietary-row {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}
.auto-import {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5px;
}
.label-text {
  font-size: 0.8rem;
  color: #ef4444;
  margin-bottom: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  border-top: 1px solid #f0f0f0;
  padding-top: 1.5rem;
}
.submit-btn {
  min-width: 150px;
  font-weight: bold;
}

.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .dietary-row {
    flex-direction: column;
    gap: 10px;
  }
  .auto-import {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
}
</style>
