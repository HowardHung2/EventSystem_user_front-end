<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTheme, ThemeSettings } from '@/shared/theme'

const { currentColor } = useTheme()

// Simple Routing State (For prototype purposes, usually use vue-router)
const currentRoute = ref(window.location.pathname)

const navigate = (path: string) => {
  window.history.pushState({}, '', path)
  currentRoute.value = path
}

// Handle Back/Forward buttons
window.addEventListener('popstate', () => {
  currentRoute.value = window.location.pathname
})

const isSettings = computed(() => currentRoute.value === '/settings')
</script>

<template>
  <div class="app-container">
    <nav class="main-nav">
      <div class="nav-brand" @click="navigate('/')">
        <span
          class="logo-dot"
          :style="{ backgroundColor: currentColor }"
        ></span>
        EventSystem
      </div>
      <div class="nav-links">
        <a
          href="/"
          @click.prevent="navigate('/')"
          :class="{ active: !isSettings }"
        >
          Home
        </a>
        <a
          href="/settings"
          @click.prevent="navigate('/settings')"
          :class="{ active: isSettings }"
        >
          Settings
        </a>
      </div>
    </nav>

    <main class="content-area">
      <ThemeSettings v-if="isSettings" />

      <div v-else class="home-page">
        <header class="hero-section" :style="{ borderColor: currentColor }">
          <h1>Welcome to EventSystem</h1>
          <p>
            Discover and manage events with traditional Taiwanese aesthetics.
          </p>
          <div class="hero-actions">
            <button class="cta-btn primary" @click="navigate('/settings')">
              Customize Theme
            </button>
            <button class="cta-btn secondary">Browse Events</button>
          </div>
        </header>

        <section class="features-grid">
          <div class="feature-card">
            <h3>📅 Upcoming Events</h3>
            <p>Check out what's happening around you this weekend.</p>
          </div>
          <div class="feature-card">
            <h3>🎟 My Tickets</h3>
            <p>Access your digital tickets and entry passes easily.</p>
          </div>
          <div class="feature-card">
            <h3>🎨 Personalized</h3>
            <p>Experience the interface in your preferred traditional color.</p>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style>
/* Global Variables & Base Styles managed by App or global css */
:root {
  /* Default Colors (Light Mode) */
  --bg-body: #f5f7fa;
  --bg-card: #ffffff;
  --bg-header: #ffffff;
  --bg-subtle: #f0f2f5;
  --bg-input: #ffffff;
  --text-main: #2c3e50;
  --text-header: #1a202c;
  --border-color: #e2e8f0;

  --primary-color: #da1884; /* Default Fallback */
}

/* Dark Mode Overrides */
body.dark-mode {
  --bg-body: #1a202c;
  --bg-card: #2d3748;
  --bg-header: #2d3748;
  --bg-subtle: #171923;
  --bg-input: #4a5568;
  --text-main: #e2e8f0;
  --text-header: #f7fafc;
  --border-color: #4a5568;
}

/* Layout Density Overrides */
body[data-density='compact'] {
  font-size: 14px;
}
body[data-density='comfortable'] {
  font-size: 16px;
}

body {
  margin: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
    sans-serif;
  background-color: var(--bg-body);
  color: var(--text-main);
  transition:
    background-color 0.3s,
    color 0.3s;
  min-height: 100vh;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Navigation */
.main-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--bg-header);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-brand {
  font-weight: bold;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--text-header);
}

.logo-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  text-decoration: none;
  color: var(--text-main);
  font-weight: 500;
  opacity: 0.7;
  transition: opacity 0.2s;
  padding: 0.5rem;
}

.nav-links a:hover,
.nav-links a.active {
  opacity: 1;
  color: var(--primary-color);
}

/* Content Area */
.content-area {
  flex: 1;
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

/* Home Page Styles */
.hero-section {
  text-align: center;
  padding: 4rem 1rem;
  background: var(--bg-card);
  border-radius: 16px;
  margin-bottom: 2rem;
  border-top: 4px solid var(--primary-color); /* Fallback */
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--text-header);
}

.hero-section p {
  font-size: 1.1rem;
  color: var(--text-main);
  opacity: 0.8;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.cta-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  border: none;
  font-size: 1rem;
}

.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cta-btn.primary {
  background-color: var(--primary-color);
  color: white;
}

.cta-btn.secondary {
  background-color: var(--bg-subtle);
  color: var(--text-main);
  border: 1px solid var(--border-color);
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: var(--bg-card);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transition: border-color 0.3s;
}

.feature-card:hover {
  border-color: var(--primary-color);
}

.feature-card h3 {
  margin-top: 0;
  color: var(--text-header);
}

.feature-card p {
  color: var(--text-main);
  opacity: 0.8;
  margin-bottom: 0;
}
</style>
