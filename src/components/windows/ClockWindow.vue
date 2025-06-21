<template>
    <div class="h-full flex flex-col items-center justify-center gap-6 bg-zinc-50">
        <div class="time-display text-6xl font-light tracking-tight">{{ time }}</div>
        <div class="date-display text-2xl opacity-80">{{ date }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useIntervalFn } from '@vueuse/core'

const time = ref('')
const date = ref('')

const updateTime = () => {
    const now = new Date()
    time.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    date.value = now.toLocaleDateString([], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

useIntervalFn(updateTime, 1000)
updateTime()
</script>