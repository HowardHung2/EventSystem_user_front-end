import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const PIN_KEY = 'layout.sidebarPinned'
const storedPin = localStorage.getItem(PIN_KEY)
const isPinned = ref<boolean>(storedPin ? JSON.parse(storedPin) : false)
const isHovering = ref<boolean>(false)
const isMobile = ref<boolean>(false)

const getMediaQuery = () =>
  typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)') : null

export function useLayout() {
  const setPinned = (value: boolean) => {
    isPinned.value = value
  }

  const togglePinned = () => {
    isPinned.value = !isPinned.value
  }

  watch(
    isPinned,
    (value) => {
      localStorage.setItem(PIN_KEY, JSON.stringify(value))
    },
    { immediate: true },
  )

  onMounted(() => {
    const mediaQuery = getMediaQuery()
    if (!mediaQuery) return

    const update = (event?: MediaQueryListEvent) => {
      isMobile.value = event ? event.matches : mediaQuery.matches
    }

    update()
    mediaQuery.addEventListener('change', update)

    onBeforeUnmount(() => {
      mediaQuery.removeEventListener('change', update)
    })
  })

  const setHovering = (value: boolean) => {
    isHovering.value = value
  }

  return {
    isPinned,
    isHovering,
    isMobile,
    setPinned,
    togglePinned,
    setHovering,
  }
}
