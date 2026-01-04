<script setup lang="ts">
import { useTheme } from './services/theme.service'
import type { SemanticColors } from './models/theme.model'

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
    <header class="settings-header">
      <h2>Preferences</h2>
      <p class="subtitle">Customize your interface experience</p>
    </header>

    <div class="settings-grid">
      <!-- Left Column: Settings -->
      <div class="settings-column">
        <!-- Semantic Colors Section -->
        <div class="settings-section">
          <h3>Semantic Colors</h3>
          <p class="section-desc">Customize colors for system states</p>

          <div class="semantic-list">
            <div
              v-for="role in semanticRoles"
              :key="role.key"
              class="semantic-item"
            >
              <div class="semantic-label">{{ role.label }}</div>
              <div class="semantic-controls">
                <!-- Preset Palette Picker -->
                <div class="mini-palette">
                  <button
                    v-for="color in colors"
                    :key="color.hex"
                    class="mini-color-btn"
                    :class="{ active: semanticColors[role.key] === color.hex }"
                    :style="{ backgroundColor: color.hex }"
                    :title="color.name"
                    @click="setSemanticColor(role.key, color.hex)"
                  ></button>
                </div>
                <!-- Native Picker Fallback -->
                <input
                  type="color"
                  class="native-picker"
                  :value="semanticColors[role.key]"
                  @input="
                    (e) =>
                      setSemanticColor(
                        role.key,
                        (e.target as HTMLInputElement).value,
                      )
                  "
                />
              </div>
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h3>Theme Color</h3>
          <p class="section-desc">Primary Brand Color</p>

          <div class="color-grid">
            <button
              v-for="color in colors"
              :key="color.hex"
              class="color-option"
              :class="{ active: currentColor === color.hex }"
              :style="{ backgroundColor: color.hex }"
              :title="color.name"
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
            </button>
          </div>
        </div>

        <div class="settings-section no-border">
          <h3>Appearance</h3>

          <!-- Dark Mode Toggle -->
          <div class="setting-item">
            <div class="setting-label">
              <span>Dark Mode</span>
            </div>
            <button
              class="toggle-switch"
              :class="{ active: isDarkMode }"
              @click="toggleDarkMode"
              role="switch"
              :aria-checked="isDarkMode"
            >
              <span class="toggle-slider"></span>
            </button>
          </div>

          <!-- Layout Density -->
          <div class="setting-item">
            <div class="setting-label">
              <span>Density</span>
            </div>
            <div class="density-options">
              <button
                class="density-btn"
                :class="{ active: layoutDensity === 'compact' }"
                @click="setDensity('compact')"
              >
                Compact
              </button>
              <button
                class="density-btn"
                :class="{ active: layoutDensity === 'comfortable' }"
                @click="setDensity('comfortable')"
              >
                Comfortable
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Preview -->
      <div class="preview-column">
        <div class="preview-sticky">
          <h4>Component Preview</h4>

          <div class="preview-group">
            <label>Semantic Buttons</label>
            <div class="btn-grid">
              <button class="sem-btn success">Success</button>
              <button class="sem-btn warning">Warning</button>
              <button class="sem-btn error">Error</button>
              <button class="sem-btn info">Info</button>
            </div>
          </div>

          <div class="preview-group">
            <label>Brand Buttons</label>
            <div class="btn-grid">
              <button class="primary-btn">Filled</button>
              <button class="primary-btn outline">Outline</button>
              <button class="primary-btn ghost">Ghost</button>
              <button class="primary-btn" disabled>Disabled</button>
            </div>
          </div>

          <div class="preview-group">
            <label>Form Elements</label>
            <div class="preview-card">
              <input
                type="text"
                class="preview-input"
                placeholder="Text Input..."
              />
              <div class="checkbox-row">
                <input type="checkbox" id="pre-check" checked />
                <label for="pre-check">Checkbox selection</label>
              </div>
            </div>
          </div>

          <div class="preview-group">
            <label>Card Example</label>
            <div class="preview-card">
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
            </div>
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
  background: var(--bg-card);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  color: var(--text-main);
  transition:
    background 0.3s,
    color 0.3s;
  border: 1px solid var(--border-color);
}

.settings-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-header);
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
  padding: 1.5rem 2rem;
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

.section-desc {
  margin: -0.5rem 0 1rem;
  font-size: 0.9rem;
  opacity: 0.7;
}

/* Semantic Colors */
.semantic-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.semantic-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.semantic-label {
  font-weight: 500;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.8;
}

.semantic-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mini-palette {
  display: flex;
  gap: 4px;
}

.mini-color-btn {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: transform 0.1s;
}

.mini-color-btn:hover {
  transform: scale(1.1);
}

.mini-color-btn.active {
  border-color: var(--text-main);
  box-shadow: 0 0 0 1px var(--text-main);
}

.native-picker {
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: none;
}

/* Color Grid */
.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(44px, 1fr));
  gap: 8px;
}

.color-option {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.color-option.active {
  border-color: var(--text-main);
  transform: scale(1.05);
}

.checkmark {
  font-weight: bold;
}

/* Toggles & Density */
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.toggle-switch {
  width: 44px;
  height: 24px;
  background-color: #ccc;
  border-radius: 24px;
  border: none;
  position: relative;
  cursor: pointer;
  padding: 0;
}

.toggle-switch.active {
  background-color: var(--primary-color);
}

.toggle-slider {
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.2s;
}

.toggle-switch.active .toggle-slider {
  transform: translateX(20px);
}

.density-options {
  display: flex;
  gap: 0.5rem;
}

.density-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--border-color);
  background: var(--bg-input);
  color: var(--text-main);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
}

.density-btn.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
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

/* Buttons */
.sem-btn {
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
}

.sem-btn.success {
  background-color: var(--color-success);
}
.sem-btn.warning {
  background-color: var(--color-warning);
}
.sem-btn.error {
  background-color: var(--color-error);
}
.sem-btn.info {
  background-color: var(--color-info);
}

.primary-btn {
  background-color: var(--primary-color);
  color: white;
  border: 1px solid var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
}

.primary-btn.outline {
  background: transparent;
  color: var(--primary-color);
}

.primary-btn.ghost {
  background: transparent;
  color: var(--primary-color);
  border-color: transparent;
}

.primary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Components */
.preview-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
}

.preview-input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-input);
  color: var(--text-main);
  margin-bottom: 0.75rem;
}

.checkbox-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
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
