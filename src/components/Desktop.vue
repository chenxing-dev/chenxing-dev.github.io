<script setup lang="ts">
import useDesktop from "@/composables/useDesktop";
import { useSettings } from "@/composables/useSettings";
import { getDesktopApps } from "@/config/apps-registry";
import Wallpaper from "@/components/desktop/Wallpaper.vue";
import DesktopIcon from "@/components/desktop/DesktopIcon.vue";
import WindowManager from "@/components/WindowManager.vue";

const { windows, openWindow, closeWindow, focusWindow } = useDesktop();
const { settings } = useSettings();
const availableApps = getDesktopApps();
</script>

<template>
    <div :class="settings.theme" class="relative w-screen h-dvh overflow-hidden select-none text-secondary">
        <!-- Desktop background and icons -->
        <Wallpaper />
        <div class="absolute w-full min-w-72
            justify-items-center 
            p-2 md:p-12 
            grid gap-2 md:gap-4 grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-14">
            <DesktopIcon v-for="app in availableApps" :key="app.id" :id="app.id" :label="app.label"
                @open="openWindow" />
        </div>

        <!-- Window Manager -->
        <WindowManager :windows="windows" @close="closeWindow" @focus="focusWindow" />
    </div>
</template>
