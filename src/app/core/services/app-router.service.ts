import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { Component } from 'vue'

type RouteMap = Record<string, Component>

// ==================================================
// [關鍵修正]：將 currentRoute 移到函式外面
// 這樣 App.vue 和 ListView.vue 就會共用同一個變數 (全域狀態)
// ==================================================
const currentRoute = ref(window.location.pathname)

export function useAppRouter(routes: RouteMap = {}) {
  // 給個預設空物件，避免 ListView 呼叫時報錯

  // 監聽瀏覽器 (上一頁/下一頁)
  const syncFromLocation = () => {
    currentRoute.value = window.location.pathname
  }

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      // 若無紀錄則導向預設列表
      navigate('/events')
    }
  }

  const navigate = (path: string) => {
    if (currentRoute.value === path) return
    window.history.pushState({}, '', path)
    currentRoute.value = path
    window.scrollTo({
      top: 0,
      behavior: 'instant',
    })
  }

  onMounted(() => {
    window.addEventListener('popstate', syncFromLocation)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('popstate', syncFromLocation)
  })

  // 處理找不到路由的情況 (Fallback)
  // 如果傳進來的 routes 是空的 (例如在 ListView 呼叫時)，就預設回傳 '/'
  const fallbackRoute = Object.keys(routes)[0] ?? '/'

  const activeRoute = computed(() =>
    Object.prototype.hasOwnProperty.call(routes, currentRoute.value)
      ? currentRoute.value
      : fallbackRoute,
  )

  const activeView = computed(() => routes[activeRoute.value])

  return {
    currentRoute,
    activeRoute,
    activeView,
    navigate,
    goBack, // 導出方法
    activeViewComponent: activeView,
  }
}
