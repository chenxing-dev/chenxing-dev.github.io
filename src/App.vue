<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Wallpaper from './components/desktop/Wallpaper.vue'
import DesktopIcon from './components/desktop/DesktopIcon.vue'
import WindowManager from './components/WindowManager.vue'
import useWindowManager from "./components/useWindowManager.ts"
import { useStorage } from '@vueuse/core'

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

const { windows, openWindow, closeWindow, focusWindow, createWindow } = useWindowManager()


// Initialize with terminal window on load
onMounted(() => {
  // Only open terminal if it's the first load
  const firstRun = useStorage('tissuepackos-first-run', true)

  if (firstRun.value) {
    windows.value = [createWindow('terminal')]
    firstRun.value = false
  }
})

</script>

<template>
  <div class="relative w-screen h-screen overflow-hidden select-none bg-zinc-50">
    <Wallpaper />

    <!-- Desktop Icons -->
    <div class="absolute top-0 left-0 p-4 grid grid-flow-row gap-4">
      <DesktopIcon v-for="(app, index) in desktopApps" :key="index" :icon="app.icon" :label="app.label" :type="app.type"
        @open="openWindow" />
    </div>

    <!-- Window Manager -->
    <WindowManager :windows="windows" @close="closeWindow" @focus="focusWindow" />
  </div>
</template>

<style>
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
