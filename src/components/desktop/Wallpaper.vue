<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'
import { ref } from 'vue'

const time = ref('')
const date = ref('')

const updateTime = () => {
    const now = new Date()
    time.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    date.value = now.toLocaleDateString([], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

// Update time every 30 seconds
useIntervalFn(updateTime, 30000)
updateTime()
</script>

<template>
    <div class="absolute inset-0 bg-gradient-to-br from-indigo-900/80 to-rose-900/80">
        <div class="absolute bottom-4 right-4 text-right text-white/80 drop-shadow-lg">
            <div class="text-6xl font-light tracking-tight">{{ time }}</div>
            <div class="text-lg mt-1">{{ date }}</div>
        </div>
    </div>
</template>