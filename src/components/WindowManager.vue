<script setup lang="ts">
import { type WindowItem } from './useWindowManager'
import Window from './windows/Window.vue'

defineProps<{
    windows: WindowItem[]
}>()

const emit = defineEmits(['close', 'focus'])
</script>

<template>
    <div class="window-manager absolute inset-0 pointer-events-none">
        <Window v-for="window in windows" :key="window.id" :window="window" @close="emit('close', $event)"
            @focus="emit('focus', $event)" />
    </div>
</template>
