<script setup lang="ts">
import { onMounted } from "vue";
import Wallpaper from "./components/desktop/Wallpaper.vue";
import DesktopIcon from "./components/desktop/DesktopIcon.vue";
import WindowManager from "./components/WindowManager.vue";
import useWindowManager from "./components/useWindowManager.ts";
import { useStorage } from "@vueuse/core";
import { getDesktopApps } from "./config/app.ts";
import { useSettings } from "./components/useSettings.ts";

const { settings } = useSettings();

// Desktop apps configuration
const desktopApps = getDesktopApps();

const { windows, openWindow, closeWindow, focusWindow } = useWindowManager();

onMounted(() => {
  // Initialize with terminal window on load
  const firstRun = useStorage("os-first-run", true);

  if (firstRun.value) {
    setTimeout(() => {
      openWindow("about_me");
      firstRun.value = false;
    }, 2000);
  }
});
</script>

<template>
  <div :class="settings.theme" class="relative w-screen h-dvh overflow-hidden select-none text-secondary">
    <Wallpaper />

    <!-- Desktop Icons -->
    <div class="absolute top-0 left-0 w-full p-2 md:p-12">
      <div
        class="grid gap-2 md:gap-4 h-full items-start justify-items-center grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-14">
        <DesktopIcon v-for="(app, index) in desktopApps" :key="index" :label="app.label" :type="app.type"
          @open="openWindow" v-show="app.showOnDesktop" />
      </div>
    </div>

    <!-- Window Manager -->
    <WindowManager :windows="windows" @close="closeWindow" @focus="focusWindow" />
  </div>
</template>

<style>
@font-face {
  font-family: 'Noto Sans SC';
  font-style: normal;
  font-weight: 400;
  font-stretch: 100%;
  src: url(/fonts/noto-sans-sc-chinese-simplified-400-normal.woff2) format('woff2');
}

@font-face {
  font-family: 'Noto Serif SC';
  font-style: normal;
  font-weight: 900;
  font-stretch: 100%;
  src: url(/fonts/noto-serif-sc-chinese-simplified-900-normal.woff2) format('woff2');
}


:root {
  --font-serif: "Noto Serif SC", sans-serif;
}

.theme-minimal {
  --color-primary: #fafafa;
  --color-secondary: #18181b;
  --color-accent: #09090b;
  --color-title-bar: var(--color-primary);
  --color-selected: #a1a1aa;
}

.theme-cozy {
  --color-primary: #f1e9d6;
  --color-secondary: #373426;
  --color-accent: #645a46;
  --color-title-bar: var(--color-primary);
  --color-selected: #c2a37a;
}

.theme-paper {
  --color-primary: #f6f2ec;
  --color-secondary: #4e4e4e;
  --color-accent: #9c9b96;
  --color-title-bar: var(--color-primary);
  --color-selected: var(--color-accent);
}

.theme-pastel {
  --color-primary: #f3d7d1;
  --color-secondary: #2d1f22;
  --color-accent: #5e524d;
  --color-title-bar: #f7ede3;
  --color-selected: #f58583;
}

.bg-primary {
  background-color: var(--color-primary) !important;
}

.bg-secondary {
  background-color: var(--color-secondary) !important;
}

.bg-accent {
  background-color: var(--color-accent) !important;
}

.text-secondary {
  color: var(--color-secondary) !important;
}

.text-selected {
  color: var(--color-selected) !important;
}

.border-primary {
  border-color: var(--color-primary) !important;
}

.border-accent {
  border-color: var(--color-accent) !important;
}

.bg-title-bar {
  background-color: var(--color-title-bar) !important;
}

.bg-selected {
  background-color: var(--color-selected) !important;
}

body {
  margin: 0;
  font-family: "Noto Sans SC", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
  user-select: none;
}

/* Smooth transitions for layout changes */
.grid {
  transition: grid-template-columns 0.3s ease;
}
</style>
