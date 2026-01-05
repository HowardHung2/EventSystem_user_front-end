export interface ThemeColor {
  name: string
  hex: string
}

export type LayoutDensity = 'compact' | 'comfortable'

export interface SemanticColors {
  success: string
  warning: string
  error: string
  info: string
}

export interface ThemeState {
  currentColor: string
  semanticColors: SemanticColors
  isDarkMode: boolean
  layoutDensity: LayoutDensity
}

export interface UseThemeReturn extends ThemeState {
  colors: ThemeColor[]
  setTheme: (hex: string) => void
  setSemanticColor: (key: keyof SemanticColors, hex: string) => void
  toggleDarkMode: () => void
  setDensity: (density: LayoutDensity) => void
}
