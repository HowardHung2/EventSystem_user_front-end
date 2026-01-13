// --- 篩選邏輯 Logic ---

import { ref, computed, type Ref } from 'vue'
import type { EventItem } from '../models/event.model'
export function useEventFiltering(
  allEvents: Ref<EventItem[]>,
  activeTab: Ref<string>,
) {
  const searchKeyword = ref('')
  const searchDateRange = ref<[Date, Date] | null>(null)
  const filterIntent = ref('all')
  const filterTimeStatus = ref('future')

  const filteredEvents = computed(() => {
    let events = [...allEvents.value]

    if (activeTab.value === 'upcoming') {
      return events
        .filter((e) => e.status === 'pending')
        .sort((a, b) => a.start.getTime() - b.start.getTime())
    }

    // --- 「歷史紀錄」 ---

    events = events.filter((e) => e.status !== 'pending')
    const now = new Date()

    // 2. 時間狀態 (根據報名截止時間 registrationEnd)
    if (filterTimeStatus.value === 'future') {
      events = events.filter((e) => e.registrationEnd >= now)
    } else if (filterTimeStatus.value === 'past') {
      events = events.filter((e) => e.registrationEnd < now)
    }
    // 'all' 則不過濾

    // 3. 關鍵字搜尋 (標題)
    if (searchKeyword.value.trim()) {
      events = events.filter((e) =>
        e.title.includes(searchKeyword.value.trim()),
      )
    }

    // 4. 日期區間
    if (searchDateRange.value) {
      const [start, end] = searchDateRange.value
      const rangeEnd = new Date(end)
      rangeEnd.setHours(23, 59, 59, 999)
      events = events.filter((e) => e.start >= start && e.start <= rangeEnd)
    }

    // 5. 參加意願狀態
    if (filterIntent.value !== 'all') {
      if (filterIntent.value === 'absent') {
        events = events.filter((e) => e.status === 'absent')
      } else {
        events = events.filter((e) => e.userIntent === filterIntent.value)
      }
    }

    // 歷史紀錄通常由近到遠排序，或依照需求調整
    return events.sort((a, b) => a.start.getTime() - b.start.getTime())
  })

  // --- 重置功能 ---
  const resetFilters = () => {
    filterTimeStatus.value = 'future'
    searchKeyword.value = ''
    searchDateRange.value = null
    filterIntent.value = 'all'
  }

  return {
    searchKeyword,
    searchDateRange,
    filterIntent,
    filterTimeStatus,
    filteredEvents,
    resetFilters,
  }
}
