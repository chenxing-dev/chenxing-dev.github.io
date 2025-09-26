<script setup lang="ts">
import Window from '@/components/Window.vue'
import type { WindowItem } from '@/types'

defineProps<{
    windows: WindowItem[]
}>()

const emit = defineEmits(['close', 'focus'])
</script>

<template>
    <div
        class="window-manager absolute inset-0 pointer-events-none w-dvw h-dvh flex items-center justify-center md:block">
        <Window v-for="window in windows" :key="window.id" :window="window" @close="emit('close', $event)"
            @focus="emit('focus', $event)" />
    </div>
</template>
