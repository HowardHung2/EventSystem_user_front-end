<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { userService } from '@/app/profile/services/user.service'
import type { UserProfile } from '@/app/profile/models/user.model'
import { Loading } from '@element-plus/icons-vue'

const isLoading = ref(false)
const isSaving = ref(false)

// 初始化表單
const form = ref<UserProfile>({
  id: '',
  role: '使用者',
  username: '',
  name: '',
  nickname: '',
  gender: '其他',
  email: '',
  school: '',
  primaryContact: '',
  phone: '',
  isPublicContact: false,
  interestedIssues: '',
  dietaryPreference: '葷',
  dietaryNote: '',
  notes: '',
  avatarUrl: '',
})

const loadData = async () => {
  isLoading.value = true
  try {
    const data = await userService.getProfile()
    form.value = data
  } catch (error) {
    ElMessage.error('資料載入失敗')
  } finally {
    console.log('載入完成，準備關閉 Loading...')
    isLoading.value = false
  }
}

const handleSave = async () => {
  isSaving.value = true
  try {
    await userService.updateProfile(form.value)
    ElMessage.success('儲存成功！')
  } catch (error) {
    ElMessage.error('儲存失敗')
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="profile-page">
    <div class="page-header">
      <h2>個人資料設定</h2>
      <p>請完善您的基本資訊以利活動報名與聯絡</p>
    </div>

    <div v-if="isLoading" class="loading-state">
      <el-icon class="is-loading"><Loading /></el-icon> 資料讀取中...
    </div>

    <div v-else class="content-wrapper">
      <el-card class="avatar-card">
        <div class="avatar-section">
          <el-avatar :size="100" class="big-avatar">
            <span class="material-symbols-outlined" style="font-size: 3rem"
              >person</span
            >
          </el-avatar>
          <div class="avatar-info">
            <h3>{{ form.nickname || form.name }}</h3>
            <p class="school-badge">{{ form.school || '尚未填寫學校' }}</p>
            <div class="role-container">
              <el-tag
                :type="
                  form.role === '超級管理員'
                    ? 'danger'
                    : form.role === '管理員'
                      ? 'warning'
                      : 'info'
                "
                effect="dark"
                round
                size="small"
              >
                {{ form.role }}
              </el-tag>
            </div>
          </div>
        </div>
      </el-card>

      <div class="form-section">
        <el-form :model="form" label-position="top" size="large">
          <el-card class="form-card">
            <template #header
              ><span class="card-title">👤 基本資料</span></template
            >

            <div class="form-row">
              <el-form-item label="真實姓名" class="half">
                <el-input v-model="form.name" placeholder="請輸入姓名" />
              </el-form-item>
              <el-form-item label="暱稱" class="half">
                <el-input v-model="form.nickname" placeholder="如何稱呼您" />
              </el-form-item>
            </div>

            <div class="form-row">
              <el-form-item label="性別" class="half">
                <el-select
                  v-model="form.gender"
                  placeholder="請選擇"
                  style="width: 100%"
                >
                  <el-option label="生理男" value="生理男" />
                  <el-option label="生理女" value="生理女" />
                  <el-option label="其他" value="其他" />
                </el-select>
              </el-form-item>
              <el-form-item label="學校 / 單位" class="half">
                <el-input
                  v-model="form.school"
                  placeholder="就讀學校或服務單位"
                />
              </el-form-item>
            </div>

            <el-form-item label="關注議題">
              <el-input
                v-model="form.interestedIssues"
                placeholder="例如：環境保護、性別平權"
              />
            </el-form-item>
          </el-card>

          <el-card class="form-card">
            <template #header
              ><span class="card-title">📞 聯絡資訊</span></template
            >

            <div class="form-row">
              <el-form-item label="電子郵件" class="half">
                <el-input
                  v-model="form.email"
                  placeholder="example@email.com"
                />
              </el-form-item>
              <el-form-item label="聯絡電話" class="half">
                <el-input
                  v-model="form.phone"
                  placeholder="09xx-xxx-xxx"
                  type="tel"
                />
              </el-form-item>
            </div>

            <div class="form-row">
              <el-form-item label="主要聯絡人" class="half">
                <el-input
                  v-model="form.primaryContact"
                  placeholder="緊急聯絡人姓名與關係"
                />
              </el-form-item>
              <el-form-item label="公開聯絡資訊" class="half switch-col">
                <el-switch
                  v-model="form.isPublicContact"
                  active-text="願意公開"
                  inactive-text="不公開"
                  inline-prompt
                  style="
                    --el-switch-on-color: #13ce66;
                    --el-switch-off-color: #ff4949;
                  "
                />
              </el-form-item>
            </div>
          </el-card>

          <el-card class="form-card last-card">
            <template #header
              ><span class="card-title">🍴 飲食與備註</span></template
            >

            <div class="form-row">
              <el-form-item label="飲食習慣" class="half">
                <el-select v-model="form.dietaryPreference" style="width: 100%">
                  <el-option label="葷食" value="葷" />
                  <el-option label="全素" value="全素" />
                  <el-option label="蛋奶素" value="蛋奶素" />
                  <el-option label="其他" value="其他" />
                </el-select>
              </el-form-item>
              <el-form-item label="忌口食物" class="half">
                <el-input
                  v-model="form.dietaryNote"
                  placeholder="例如：不吃牛、海鮮過敏"
                />
              </el-form-item>
            </div>

            <el-form-item label="備註">
              <el-input
                v-model="form.notes"
                type="textarea"
                :rows="3"
                placeholder="其他想告訴我們的事..."
              />
            </el-form-item>
          </el-card>

          <div class="sticky-footer-placeholder"></div>
          <div class="sticky-footer">
            <el-button
              type="primary"
              size="large"
              :loading="isSaving"
              @click="handleSave"
              class="save-btn"
              round
            >
              儲存變更
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
  padding-bottom: 4rem; /* 預留底部空間 */
}

/* 標題 */
.page-header {
  margin-bottom: 2rem;
  text-align: center;
}
.page-header h2 {
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 700;
}
.page-header p {
  color: #666;
  margin: 0;
  font-size: 0.95rem;
}

/* 佈局容器 */
.content-wrapper {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  align-items: start;
}

/* 頭像卡片 */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 0;
  text-align: center;
}
.big-avatar {
  background: var(--primary-color);
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.avatar-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
}
.school-badge {
  background: #f0f2f5;
  color: #606266;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  margin: 0.5rem 0;
  display: inline-block;
}

/* 表單樣式 */
.form-card {
  margin-bottom: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05); /* 更輕柔的陰影 */
  border: 1px solid #ebeef5;
}
.card-title {
  font-weight: 700;
  font-size: 1rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-row {
  display: flex;
  gap: 20px;
}
.half {
  flex: 1;
}

/* 按鈕樣式 (Desktop) */
.sticky-footer {
  text-align: right;
  margin-top: 20px;
}
.save-btn {
  width: 180px;
  font-weight: bold;
  letter-spacing: 1px;
}

/* =========================================
   📱 Mobile RWD 專區 (關鍵修改)
   ========================================= */
@media (max-width: 768px) {
  .profile-page {
    padding: 1rem 12px; /* 縮減邊距 */
    padding-bottom: 90px; /* 增加底部留白，避免被固定按鈕擋住 */
  }

  .page-header {
    margin-bottom: 1.5rem;
  }
  .page-header h2 {
    font-size: 1.5rem;
  }

  /* 變更為單欄佈局 */
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  /* 頭像區微調 */
  .avatar-section {
    flex-direction: row; /* 改為橫向排列 (類似名片) */
    align-items: center;
    justify-content: flex-start;
    padding: 0.5rem;
    gap: 16px;
    text-align: left;
  }
  .big-avatar {
    width: 70px;
    height: 70px; /* 縮小頭像 */
    margin-bottom: 0;
  }
  .avatar-info {
    flex: 1;
  }
  .avatar-info h3 {
    margin-bottom: 0.2rem;
  }

  /* 表單區調整 */
  .form-card {
    margin-bottom: 12px;
  }
  /* 卡片標題改小一點 */
  .el-card__header {
    padding: 12px 16px;
  }
  .card-title {
    font-size: 0.95rem;
  }

  /* 欄位改為垂直堆疊 */
  .form-row {
    flex-direction: column;
    gap: 0;
  }

  /* switch 開關加一點上邊距，避免太擠 */
  .switch-col {
    margin-top: 10px;
  }

  /* ✨ 底部按鈕：釘選在最下方 (App style) */
  .sticky-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(5px); /* 毛玻璃效果 */
    padding: 12px 16px;
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);
    z-index: 100;
    box-sizing: border-box;
    text-align: center;
    /* 處理 iPhone 底部橫條 Safe Area */
    padding-bottom: calc(12px + env(safe-area-inset-bottom));
  }

  .save-btn {
    width: 100%; /* 按鈕滿版 */
    height: 48px; /* 加大觸控區域 */
    font-size: 1.05rem;
  }
}
</style>
