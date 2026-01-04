import type { ThemeColor, SemanticColors } from './theme.model'

export const TAIWAN_TRADITIONAL_COLORS: ThemeColor[] = [
  { name: 'Taiwan Flag Red', hex: '#FE0000' },
  { name: 'Taiwan Flag Blue', hex: '#000097' },
  { name: 'Taiwan Flag White', hex: '#FFFFFF' },
  { name: 'Joyous Red', hex: '#DA1884' },
  { name: 'Formosan Emerald Green', hex: '#50C878' },
  { name: 'Formosan Jade Green', hex: '#00A36C' },
  { name: 'Bountiful Gold', hex: '#866D4B' },
  { name: 'Taiwan Gold', hex: '#C7AA71' },
]

export const STORAGE_KEYS = {
  COLOR: 'taiwan-theme-color',
  SEMANTIC_COLORS: 'taiwan-theme-semantic',
  DARK_MODE: 'taiwan-theme-dark',
  DENSITY: 'taiwan-theme-density',
} as const

export const DEFAULT_SEMANTIC_COLORS: SemanticColors = {
  success: '#50C878', // Formosan Emerald Green
  warning: '#C7AA71', // Taiwan Gold (closest to warning/yellow)
  error: '#FE0000', // Taiwan Flag Red
  info: '#000097', // Taiwan Flag Blue
}

export const DEFAULTS = {
  COLOR: TAIWAN_TRADITIONAL_COLORS[0]?.hex || '#FE0000',
  SEMANTIC: DEFAULT_SEMANTIC_COLORS,
  DARK_MODE: false,
  DENSITY: 'comfortable' as const,
}
