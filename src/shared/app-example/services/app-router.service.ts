import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { Component } from 'vue'

type RouteMap = Record<string, Component>

export function useAppRouter(routes: RouteMap) {
  const currentRoute = ref(window.location.pathname)

  const syncFromLocation = () => {
    currentRoute.value = window.location.pathname
  }

  const navigate = (path: string) => {
    if (currentRoute.value === path) return
    window.history.pushState({}, '', path)
    currentRoute.value = path
  }

  onMounted(() => {
    window.addEventListener('popstate', syncFromLocation)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('popstate', syncFromLocation)
  })

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
  }
}
