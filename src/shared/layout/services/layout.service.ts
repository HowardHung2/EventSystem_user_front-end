import { ref, watch } from 'vue'

const PIN_KEY = 'layout.sidebarPinned'
const storedPin = localStorage.getItem(PIN_KEY)
const isPinned = ref<boolean>(storedPin ? JSON.parse(storedPin) : false)
const isHovering = ref<boolean>(false)

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

  const setHovering = (value: boolean) => {
    isHovering.value = value
  }

  return {
    isPinned,
    isHovering,
    setPinned,
    togglePinned,
    setHovering,
  }
}
