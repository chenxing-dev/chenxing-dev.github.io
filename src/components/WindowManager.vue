<script setup lang="ts">
import { type WindowItem } from './useWindowManager'
import Window from './windows/Window.vue'

defineProps<{
    windows: WindowItem[]
}>()

const emit = defineEmits(['close', 'focus', 'minimize'])
</script>

<template>
    <div class="window-manager">
        <Window v-for="window in windows" :key="window.id" :window="window" @close="emit('close', $event)"
            @focus="emit('focus', $event)" @minimize="emit('minimize', $event)" />
    </div>
</template>

<style>
.window-manager {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

/* Make sure draggable areas are interactive */
.vdr {
    pointer-events: auto;
}
</style>