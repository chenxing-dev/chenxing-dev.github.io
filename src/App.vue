<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Wallpaper from './components/desktop/Wallpaper.vue'
import DesktopIcon from './components/desktop/DesktopIcon.vue'
import WindowManager from './components/WindowManager.vue'
import useWindowManager from "./components/useWindowManager.ts"
import { useStorage } from '@vueuse/core'
import { getDesktopApps } from './config/app.ts'

// Desktop apps configuration
const desktopApps = getDesktopApps()

const { windows, openWindow, closeWindow, focusWindow, createWindow } = useWindowManager()


// Initialize with terminal window on load
onMounted(() => {
  // Only open terminal if it's the first load
  const firstRun = useStorage('os-first-run', true)

  if (firstRun.value) {
    windows.value = [createWindow('terminal'), createWindow('clock')]
    firstRun.value = false
  }
})

</script>

<template>
  <div class="relative w-screen h-screen overflow-hidden select-none text-zinc-900">
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
@import url(https://fonts.bunny.net/css?family=noto-serif-sc:400,900);
@import url(https://fonts.bunny.net/css?family=noto-sans-sc:400,900);

:root {
  --font-serif: 'Noto Serif SC', sans-serif;
}

body {
  margin: 0;
  font-family: 'Noto Sans SC', system-ui, sans-serif;
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
