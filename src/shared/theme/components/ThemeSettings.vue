<script setup lang="ts">
import { useTheme } from '../services/theme.service'
import type { SemanticColors } from '../models/theme.model'

const {
  colors,
  currentColor,
  setTheme,
  semanticColors,
  setSemanticColor,
  isDarkMode,
  toggleDarkMode,
  layoutDensity,
  setDensity,
} = useTheme()

// Helper to check contrast for checkmark visibility
const getContrastColor = (hex: string): string => {
  if (!hex || hex.length < 7) return 'white'
  const r = parseInt(hex.substr(1, 2), 16)
  const g = parseInt(hex.substr(3, 2), 16)
  const b = parseInt(hex.substr(5, 2), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? 'black' : 'white'
}

const semanticRoles: { key: keyof SemanticColors; label: string }[] = [
  { key: 'success', label: 'Success / Safe' },
  { key: 'warning', label: 'Warning / Caution' },
  { key: 'error', label: 'Error / Danger' },
  { key: 'info', label: 'Info / Notice' },
]
</script>

<template>
  <div class="theme-settings">
    <el-card shadow="never" class="settings-header">
      <div class="header-content">
        <h2>Preferences</h2>
        <p class="subtitle">Customize your interface experience</p>
      </div>
    </el-card>

    <div class="settings-grid">
      <!-- Left Column: Settings -->
      <div class="settings-column">
        <!-- Semantic Colors Section -->
        <el-card shadow="never" class="settings-section">
          <template #header>
            <div class="section-header">
              <h3>Semantic Colors</h3>
              <p class="section-desc">Customize colors for system states</p>
            </div>
          </template>

          <el-form label-position="top" class="semantic-form">
            <el-form-item
              v-for="role in semanticRoles"
              :key="role.key"
              :label="role.label"
            >
              <el-color-picker
                :model-value="semanticColors[role.key]"
                :predefine="colors.map((color) => color.hex)"
                @change="
                  (value: string | null) =>
                    value && setSemanticColor(role.key, value)
                "
              />
            </el-form-item>
          </el-form>
        </el-card>

        <el-card shadow="never" class="settings-section">
          <template #header>
            <div class="section-header">
              <h3>Theme Color</h3>
              <p class="section-desc">Primary Brand Color</p>
            </div>
          </template>

          <el-space wrap class="color-grid">
            <el-button
              v-for="color in colors"
              :key="color.hex"
              class="color-option"
              :class="{ active: currentColor === color.hex }"
              :style="{ backgroundColor: color.hex }"
              @click="setTheme(color.hex)"
            >
              <span
                v-if="currentColor === color.hex"
                class="checkmark"
                :style="{ color: getContrastColor(color.hex) }"
              >
                ✓
              </span>
              <span class="sr-only">{{ color.name }}</span>
            </el-button>
            <el-color-picker
              :model-value="currentColor"
              :predefine="colors.map((color) => color.hex)"
              @change="(value: string | null) => value && setTheme(value)"
            />
          </el-space>
        </el-card>

        <el-card shadow="never" class="settings-section no-border">
          <template #header>
            <div class="section-header">
              <h3>Appearance</h3>
            </div>
          </template>

          <el-form
            label-position="left"
            label-width="110px"
            class="appearance-form"
          >
            <el-form-item label="Dark Mode">
              <el-switch :model-value="isDarkMode" @change="toggleDarkMode" />
            </el-form-item>

            <el-form-item label="Density">
              <el-radio-group :model-value="layoutDensity" @change="setDensity">
                <el-radio-button label="compact">Compact</el-radio-button>
                <el-radio-button label="comfortable">
                  Comfortable
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-card>
      </div>

      <!-- Right Column: Preview -->
      <div class="preview-column">
        <div class="preview-sticky">
          <h4>Component Preview</h4>

          <div class="preview-group">
            <label>Semantic Buttons</label>
            <el-space wrap class="btn-grid">
              <el-button type="success">Success</el-button>
              <el-button type="warning">Warning</el-button>
              <el-button type="danger">Error</el-button>
              <el-button type="info">Info</el-button>
            </el-space>
          </div>

          <div class="preview-group">
            <label>Brand Buttons</label>
            <el-space wrap class="btn-grid">
              <el-button type="primary">Filled</el-button>
              <el-button type="primary" plain>Outline</el-button>
              <el-button type="primary" text>Ghost</el-button>
              <el-button type="primary" disabled>Disabled</el-button>
            </el-space>
          </div>

          <div class="preview-group">
            <label>Form Elements</label>
            <el-card shadow="never" class="preview-card">
              <el-input placeholder="Text Input..." />
              <el-checkbox label="Checkbox selection" :model-value="true" />
            </el-card>
          </div>

          <div class="preview-group">
            <label>Card Example</label>
            <el-card shadow="never" class="preview-card">
              <div class="card-title">Taiwan Traditional Theme</div>
              <p class="card-text">
                Current selection:
                <span :style="{ color: currentColor }">{{
                  colors.find((c) => c.hex === currentColor)?.name
                }}</span>
              </p>
              <div class="card-footer">
                <small>Updated via localStorage</small>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.theme-settings {
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  color: var(--text-main);
  transition:
    background 0.3s,
    color 0.3s;
}

.settings-header {
  border-bottom: 1px solid var(--border-color);
  border-radius: 0;
}

.header-content {
  padding: 0.5rem 0;
}

.settings-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-header);
}

.subtitle {
  margin: 0.5rem 0 0;
  opacity: 0.7;
  font-size: 0.9rem;
}

.settings-grid {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .settings-grid {
    grid-template-columns: 1fr 400px;
  }
}

.settings-column {
  border-right: 1px solid var(--border-color);
}

.settings-section {
  border-bottom: 1px solid var(--border-color);
}

.settings-section.no-border {
  border-bottom: none;
}

.settings-section h3 {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  color: var(--text-header);
}

.section-header {
  display: flex;
  flex-direction: column;
}

.section-desc {
  margin: 0.35rem 0 0;
  font-size: 0.9rem;
  opacity: 0.7;
}

.semantic-form :deep(.el-form-item) {
  margin-bottom: 0.75rem;
}

/* Color Grid */
.color-grid {
  align-items: center;
}

.color-option {
  width: 40px;
  height: 40px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-option.active {
  border-color: var(--text-main);
}

.checkmark {
  font-weight: bold;
}

.appearance-form :deep(.el-form-item__content) {
  justify-content: flex-end;
}

/* Right Column: Preview */
.preview-column {
  background: var(--bg-subtle);
  padding: 1.5rem 2rem;
}

.preview-sticky {
  position: sticky;
  top: 2rem;
}

.preview-column h4 {
  margin: 0 0 1.5rem;
  opacity: 0.5;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.preview-group {
  margin-bottom: 2rem;
}

.preview-group label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  opacity: 0.6;
}

.btn-grid {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* Components */
.preview-card {
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.theme-settings :deep(.el-card) {
  background: var(--bg-card);
  color: var(--text-main);
}

.theme-settings :deep(.el-card__header),
.theme-settings :deep(.el-form-item__label) {
  color: var(--text-header);
}

.theme-settings :deep(.el-radio-button__inner) {
  color: var(--text-main);
}

.card-title {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--text-header);
}

.card-text {
  font-size: 0.9rem;
  margin: 0 0 1rem;
  opacity: 0.8;
}

.card-footer {
  border-top: 1px solid var(--border-color);
  padding-top: 0.5rem;
  opacity: 0.5;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
