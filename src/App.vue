<script setup lang="ts">

import { ref, onMounted } from 'vue'
import { useStorage } from '@vueuse/core'
import Wallpaper from './components/desktop/Wallpaper.vue'
import DesktopIcon from './components/desktop/DesktopIcon.vue'
import WindowManager from './components/WindowManager.vue'

// Define window interface
interface WindowConfig {
  id: number
  type: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
  minimized: boolean
}

// Desktop apps configuration
const desktopApps = ref([
  { type: 'gaming', icon: '🎮', label: 'Games' },
  { type: 'terminal', icon: '🐧', label: 'Terminal' },
  { type: 'scripts', icon: '📜', label: 'Scripts' },
  { type: 'code_projects', icon: '💻', label: 'Projects' },
  { type: 'about_me', icon: '👤', label: 'About' },
  { type: 'contact', icon: '✉️', label: 'Contact' },
  { type: 'clock', icon: '🕒', label: 'Clock' },
  { type: 'settings', icon: '⚙️', label: 'Settings' },
])

// Window manager state
const zIndexCounter = ref(1)
const windows = useStorage<WindowConfig[]>('tissuepackos-windows', [])

const openWindow = (type: string) => {
  const id = Date.now()
  windows.value.push({
    id,
    type,
    position: { x: 100 + windows.value.length * 20, y: 100 + windows.value.length * 20 },
    size: { width: 600, height: 400 },
    zIndex: zIndexCounter.value++,
    minimized: false
  })
}

const closeWindow = (id: number) => {
  windows.value = windows.value.filter(w => w.id !== id)
}

const focusWindow = (id: number) => {
  windows.value.forEach(w => {
    if (w.id === id) {
      w.zIndex = zIndexCounter.value++
      w.minimized = false
    }
  })
}

const minimizeWindow = (id: number) => {
  windows.value = windows.value.map(w =>
    w.id === id ? { ...w, minimized: !w.minimized } : w
  )
}

// Initialize with terminal window on load
onMounted(() => {
  openWindow('terminal')
})

</script>

<template>
  <div class="relative max-w-screen h-screen overflow-hidden select-none bg-gray-900">
    <Wallpaper />

    <!-- Desktop Icons -->
    <div class="absolute top-0 left-0 p-4 grid grid-flow-row gap-4">
      <DesktopIcon v-for="(app, index) in desktopApps" :key="index" :icon="app.icon" :label="app.label"
        @open="openWindow(app.type)" />
    </div>

    <!-- Window Manager -->
    <WindowManager :windows="windows" @close="closeWindow" @focus="focusWindow" @minimize="minimizeWindow" />
  </div>
</template>

<style>
/* Global styles for OS-like interface */
body {
  margin: 0;
  font-family: 'Segoe UI', 'Noto Sans', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
  user-select: none;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(100, 100, 100, 0.4);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 100, 100, 0.6);
}
</style>
