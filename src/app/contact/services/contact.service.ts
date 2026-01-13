// 資料存取（Service）

import type { Contact, Group } from '../models/contact.model'

// --- 模擬資料庫 (Mock Database) ---
// 注意：這裡的 count 可以先寫 0，因為我們會用程式自動算出來覆蓋它
const MOCK_GROUPS: Group[] = [
  { id: 1, name: '第五屆兒少代表', count: 0 },
  { id: 2, name: '桃園市政府社會局', count: 0 },
  { id: 3, name: '第二屆兒少代表', count: 0 },
  { id: 4, name: '第三屆兒少代表', count: 0 },
  { id: 5, name: '第四屆兒少代表', count: 0 },
  { id: 6, name: '台灣桃湛', count: 0 },
]

const MOCK_CONTACTS: Contact[] = [
  {
    id: 1,
    name: '吳小達',
    gender: '女',
    email: 'linda@gmail.com',
    tag: '第五屆兒少代表',
    groupId: 1,
  },
  {
    id: 2,
    name: '洪餅乾',
    gender: '男',
    email: 'cookie@gmail.com',
    tag: '桃園市政府社會局',
    groupId: 2,
  },
  {
    id: 3,
    name: '楊小黑',
    gender: '男',
    email: 'ting@gmail.com',
    tag: '台灣桃湛',
    groupId: 6,
  },
  {
    id: 4,
    name: '傳金毛',
    gender: '男',
    email: 'food@gmail.com',
    tag: '台灣桃湛',
    groupId: 6,
  },
  {
    id: 5,
    name: '林小華',
    gender: '女',
    email: 'hua@gmail.com',
    tag: '第五屆兒少代表',
    groupId: 1,
  },
  // ... 你可以在這裡複製更多人，測試數字會不會自動增加
]

export const contactService = {
  // 取得所有聯絡人
  async getAllContacts(): Promise<Contact[]> {
    return new Promise((resolve) =>
      setTimeout(() => resolve(MOCK_CONTACTS), 300),
    )
  },

  // 取得所有群組列表 (🔥 修改這裡：動態計算人數)
  async getGroups(): Promise<Group[]> {
    // 1. 跑迴圈，算出每個群組的實際人數
    const groupsWithRealCount = MOCK_GROUPS.map((group) => {
      // 在所有聯絡人中，計算有多少人的 groupId 等於目前這個 group.id
      const realCount = MOCK_CONTACTS.filter(
        (contact) => contact.groupId === group.id,
      ).length

      // 回傳更新後的群組資料 (展開原本屬性，並覆蓋 count)
      return {
        ...group,
        count: realCount,
      }
    })

    return new Promise((resolve) =>
      setTimeout(() => resolve(groupsWithRealCount), 300),
    )
  },

  // 取得「特定群組」底下的成員
  async getGroupMembers(groupId: number): Promise<Contact[]> {
    const members = MOCK_CONTACTS.filter((c) => c.groupId === groupId)
    return new Promise((resolve) => setTimeout(() => resolve(members), 300))
  },
}
