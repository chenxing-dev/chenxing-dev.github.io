<script setup lang="ts">
import { markRaw } from "vue";

import useWindowState from "@/composables/useWindowState";
import { useSettings } from "@/composables/useSettings";
import { getDesktopApps } from "@/config/apps-registry";
import Wallpaper from "@/components/desktop/Wallpaper.vue";
import DesktopIcon from "@/components/desktop/DesktopIcon.vue";
import WindowLayer from "@/components/WindowLayer.vue";

const { windows, openWindow, closeWindow, focusWindow } = useWindowState();
const { settings } = useSettings();

// Make the apps list non-reactive
// as it doesn't change during runtime
// and to avoid unnecessary re-renders
const desktopApps = markRaw(getDesktopApps().filter((app) => !app.pinToBottomRight));
const bottomRightApps = markRaw(getDesktopApps().filter((app) => app.pinToBottomRight));
</script>

<template>
  <main
    :class="settings.theme"
    class="relative w-screen h-dvh overflow-hidden select-none text-secondary"
    aria-label="Desktop"
  >
    <!-- Desktop background and icons -->
    <Wallpaper />
    <div
      class="absolute inset-0 min-w-72 flex flex-col gap-2 p-2 md:gap-4 md:p-12"
      aria-label="Desktop apps"
      role="navigation"
    >
      <div
        v-memo="[desktopApps]"
        class="min-h-0 flex-1 content-start justify-items-center grid gap-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-6 md:gap-4 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-14"
      >
        <DesktopIcon
          v-for="app in desktopApps"
          :key="app.id"
          :id="app.id"
          :label="app.label"
          :link="app.link"
          @open="openWindow"
        />
      </div>
      <div
        v-if="bottomRightApps.length"
        v-memo="[bottomRightApps]"
        class="justify-items-center grid gap-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-6 md:gap-4 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-14"
      >
        <DesktopIcon
          v-for="app in bottomRightApps"
          :key="app.id"
          :id="app.id"
          :label="app.label"
          :link="app.link"
          :style="{ gridColumn: '-2 / -1' }"
          @open="openWindow"
        />
      </div>
    </div>

    <!-- Window Layer -->
    <WindowLayer :windows="windows" @close="closeWindow" @focus="focusWindow" />
  </main>
</template>
