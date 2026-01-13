<!-- 聯絡人UI -->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, ArrowLeft } from '@element-plus/icons-vue' // 引入圖示

import { contactService } from '../services/contact.service'
import type { Contact, Group } from '../models/contact.model'

// --- 狀態管理 ---
const activeTab = ref('individual')
const searchName = ref('')
const isLoading = ref(false)

// 資料狀態
const contacts = ref<Contact[]>([])
const groups = ref<Group[]>([])

// 群組詳情模式狀態
const currentGroup = ref<Group | null>(null) // 當前選中的群組，null 代表在看列表
const groupMembers = ref<Contact[]>([]) // 該群組的成員

// --- 初始化載入資料 ---
const initData = async () => {
  isLoading.value = true
  try {
    const [cData, gData] = await Promise.all([
      contactService.getAllContacts(),
      contactService.getGroups(),
    ])
    contacts.value = cData
    groups.value = gData
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  initData()
})

// --- 邏輯處理 ---

// 搜尋過濾 (針對個別聯絡人 Tab)
const filteredContacts = computed(() => {
  if (!searchName.value) return contacts.value
  return contacts.value.filter((c) => c.name.includes(searchName.value))
})

const handleSearch = () => {
  // 如果是接後端，這裡會呼叫 contactService.searchContacts(name)
  console.log('搜尋:', searchName.value)
}

const handleReset = () => {
  searchName.value = ''
}

// 📌 核心功能：查看群組更多
const handleViewMore = async (group: Group) => {
  isLoading.value = true
  try {
    // 1. 設定當前群組標題
    currentGroup.value = group
    // 2. 向 Service (模擬後端) 請求該群組的成員
    groupMembers.value = await contactService.getGroupMembers(group.id)
  } finally {
    isLoading.value = false
  }
}

// 📌 核心功能：返回群組列表
const handleBackToGroups = () => {
  currentGroup.value = null
  groupMembers.value = []
}
</script>

<template>
  <div class="contact-list-page">
    <div class="tabs-container">
      <el-tabs v-model="activeTab" stretch class="custom-tabs">
        <el-tab-pane label="👤 個別聯絡人" name="individual" />
        <el-tab-pane label="👥 群組" name="group" />
      </el-tabs>
    </div>

    <div class="content-area" v-loading="isLoading">
      <div v-if="activeTab === 'individual'">
        <div class="search-bar">
          <div class="search-label">姓名:</div>
          <el-input
            v-model="searchName"
            placeholder="請輸入"
            class="search-input"
            clearable
          />
          <div class="search-actions">
            <el-button type="primary" :icon="Search" @click="handleSearch"
              >搜尋</el-button
            >
            <el-button @click="handleReset">重置</el-button>
          </div>
        </div>

        <div class="card-list">
          <div
            v-for="contact in filteredContacts"
            :key="contact.id"
            class="contact-card"
          >
            <div class="card-header">
              <div class="user-info">
                <span class="user-name">{{ contact.name }}</span>
                <span class="user-gender">{{ contact.gender }}</span>
              </div>
              <div class="user-tag">{{ contact.tag }}</div>
            </div>
            <div class="divider"></div>
            <div class="card-body">
              <span class="email-text">{{ contact.email }}</span>
            </div>
          </div>

          <el-empty
            v-if="filteredContacts.length === 0"
            description="查無資料"
          />
        </div>
      </div>

      <div v-else>
        <div v-if="!currentGroup" class="card-list group-list-padding">
          <div v-for="group in groups" :key="group.id" class="group-card">
            <div class="group-info">
              <span class="group-name">{{ group.name }}</span>
              <span class="group-count">({{ group.count }})</span>
            </div>
            <div class="group-action" @click="handleViewMore(group)">
              查看更多
            </div>
          </div>
        </div>

        <div v-else class="group-detail-view">
          <div class="detail-header">
            <el-button circle :icon="ArrowLeft" @click="handleBackToGroups" />
            <h3>
              {{ currentGroup.name }}
              <small>({{ groupMembers.length }}人)</small>
            </h3>
          </div>

          <div class="card-list">
            <div
              v-for="member in groupMembers"
              :key="member.id"
              class="contact-card"
            >
              <div class="card-header">
                <div class="user-info">
                  <span class="user-name">{{ member.name }}</span>
                  <span class="user-gender">{{ member.gender }}</span>
                </div>
                <div class="user-tag">{{ member.tag }}</div>
              </div>
              <div class="divider"></div>
              <div class="card-body">
                <span class="email-text">{{ member.email }}</span>
              </div>
            </div>

            <el-empty
              v-if="groupMembers.length === 0"
              description="此群組目前沒有成員"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 全局容器 */
.contact-list-page {
  background-color: #f5f7fa;
  min-height: 100vh;
}
.tabs-container {
  background: #fff;
  padding-top: 10px;
}
.content-area {
  padding: 10px;
  max-width: 800px;
  margin: 0 auto;
}

/* 搜尋與按鈕 */
.search-bar {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 12px;
  gap: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.search-label {
  font-weight: bold;
  white-space: nowrap;
}
.search-input {
  flex: 1;
}

/* 卡片列表通用 */
.card-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 聯絡人卡片 */
.contact-card {
  background: #fff;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}
.card-header {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  height: auto !important;
  min-height: unset !important;
  overflow: visible !important;
  align-items: flex-start !important;
}

.user-info {
  display: flex;
  gap: 8px;
  overflow: visible !important;
  min-width: 0;
  align-items: flex-start;
}

.user-name {
  font-size: 1.1rem !important;
  font-weight: 700 !important;
  color: #333 !important;
  line-height: 1.25 !important;

  display: inline-block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.user-gender {
  color: #666;
  font-size: 0.9rem;
}
.user-tag {
  background-color: #fff8e6;
  color: #d48806;
  border: 1px solid #ffebb5;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
}
.divider {
  height: 1px;
  background-color: #eee;
  margin: 0;
}
.card-body {
  padding: 12px 16px;
  color: #555;
}

/* 群組卡片 */
.group-list-padding {
  padding-top: 10px;
}
.group-card {
  background: #fff;
  padding: 20px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.group-info {
  font-size: 1.05rem;
  color: #333;
  font-weight: 500;
}
.group-action {
  color: #409eff;
  font-size: 0.9rem;
  cursor: pointer;
}
.group-action:hover {
  text-decoration: underline;
}

/* 群組詳情 header */
.detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 0 4px;
}
.detail-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

/* RWD */
@media (max-width: 480px) {
  .contact-card .user-info .user-name {
    display: inline !important;
    visibility: visible !important;
    opacity: 1 !important;
    color: #333 !important;
    font-size: 1.1rem !important;
    line-height: 1.2 !important;
    flex-direction: column;
    gap: 2px;
  }
}
</style>
