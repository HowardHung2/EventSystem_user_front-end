import { ref, watch } from 'vue'
import {
  TAIWAN_TRADITIONAL_COLORS,
  STORAGE_KEYS,
  DEFAULTS,
} from '../models/theme.constants'
import type { LayoutDensity, SemanticColors } from '../models/theme.model'

// State (Singleton pattern to share state across components)
const currentColor = ref<string>(
  localStorage.getItem(STORAGE_KEYS.COLOR) || DEFAULTS.COLOR,
)

const storedSemantic = localStorage.getItem(STORAGE_KEYS.SEMANTIC_COLORS)
const semanticColors = ref<SemanticColors>(
  storedSemantic ? JSON.parse(storedSemantic) : DEFAULTS.SEMANTIC,
)

const isDarkMode = ref<boolean>(
  JSON.parse(
    localStorage.getItem(STORAGE_KEYS.DARK_MODE) ?? String(DEFAULTS.DARK_MODE),
  ),
)
const layoutDensity = ref<LayoutDensity>(
  (localStorage.getItem(STORAGE_KEYS.DENSITY) as LayoutDensity) ||
    DEFAULTS.DENSITY,
)

export function useTheme() {
  document.documentElement.style.setProperty(
    '--el-card-bg-color',
    'var(--bg-card)',
  )
  document.documentElement.style.setProperty(
    '--el-border-color',
    'var(--border-color)',
  )
  document.documentElement.style.setProperty(
    '--el-text-color-regular',
    'var(--text-main)',
  )
  document.documentElement.style.setProperty(
    '--el-text-color-primary',
    'var(--text-header)',
  )

  // Actions
  const setTheme = (hex: string) => {
    currentColor.value = hex
  }

  const setSemanticColor = (key: keyof SemanticColors, hex: string) => {
    semanticColors.value = {
      ...semanticColors.value,
      [key]: hex,
    }
  }

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
  }

  const setDensity = (density: LayoutDensity) => {
    layoutDensity.value = density
  }

  // Watchers (Side Effects)
  watch(
    currentColor,
    (newColor) => {
      document.documentElement.style.setProperty('--primary-color', newColor)
      document.documentElement.style.setProperty('--el-color-primary', newColor)
      localStorage.setItem(STORAGE_KEYS.COLOR, newColor)
    },
    { immediate: true },
  )

  watch(
    semanticColors,
    (newColors) => {
      document.documentElement.style.setProperty(
        '--color-success',
        newColors.success,
      )
      document.documentElement.style.setProperty(
        '--color-warning',
        newColors.warning,
      )
      document.documentElement.style.setProperty(
        '--color-error',
        newColors.error,
      )
      document.documentElement.style.setProperty('--color-info', newColors.info)
      document.documentElement.style.setProperty(
        '--el-color-success',
        newColors.success,
      )
      document.documentElement.style.setProperty(
        '--el-color-warning',
        newColors.warning,
      )
      document.documentElement.style.setProperty(
        '--el-color-danger',
        newColors.error,
      )
      document.documentElement.style.setProperty(
        '--el-color-info',
        newColors.info,
      )
      localStorage.setItem(
        STORAGE_KEYS.SEMANTIC_COLORS,
        JSON.stringify(newColors),
      )
    },
    { immediate: true, deep: true },
  )

  watch(
    isDarkMode,
    (val) => {
      if (val) {
        document.body.classList.add('dark-mode')
      } else {
        document.body.classList.remove('dark-mode')
      }
      localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(val))
    },
    { immediate: true },
  )

  watch(
    layoutDensity,
    (val) => {
      document.body.setAttribute('data-density', val)
      localStorage.setItem(STORAGE_KEYS.DENSITY, val)
    },
    { immediate: true },
  )

  return {
    // State
    currentColor,
    semanticColors,
    isDarkMode,
    layoutDensity,
    // Actions
    setTheme,
    setSemanticColor,
    toggleDarkMode,
    setDensity,
    // Data
    colors: TAIWAN_TRADITIONAL_COLORS,
  }
}
