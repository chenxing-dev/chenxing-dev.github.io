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
const availableApps = markRaw(getDesktopApps());
</script>

<template>
  <div
    :class="settings.theme"
    class="relative w-screen h-dvh overflow-hidden select-none text-secondary"
  >
    <!-- Desktop background and icons -->
    <Wallpaper />
    <!-- Memorize icons grid: it won't update unless availableApps ref changes -->
    <div
      v-memo="[availableApps]"
      class="absolute w-full min-w-72 justify-items-center p-2 md:p-12 grid gap-2 md:gap-4 grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-14"
    >
      <DesktopIcon
        v-for="app in availableApps"
        :key="app.id"
        :id="app.id"
        :label="app.label"
        @open="openWindow"
      />
    </div>

    <!-- Window Layer -->
    <WindowLayer :windows="windows" @close="closeWindow" @focus="focusWindow" />
  </div>
</template>
