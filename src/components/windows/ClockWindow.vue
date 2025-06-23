<template>
    <div class="time-display text-center text-xl flex justify-center h-full items-center">{{ formattedTime }}</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useIntervalFn } from '@vueuse/core'

const time = ref(new Date())

// format day names
const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
const monthNames = [
    'jan', 'feb', 'mar', 'apr', 'may', 'jun',
    'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
]

// Computed formatted time
const formattedTime = computed(() => {
    const day = dayNames[time.value.getDay()]
    const date = time.value.getDate().toString().padStart(2, '0')
    const month = monthNames[time.value.getMonth()]
    const year = time.value.getFullYear()

    const hours = time.value.getHours().toString().padStart(2, '0')
    const minutes = time.value.getMinutes().toString().padStart(2, '0')
    const seconds = time.value.getSeconds().toString().padStart(2, '0')

    return `${day} ${date} ${month} ${year} ${hours}:${minutes}:${seconds}`
})

const updateTime = () => {
    time.value = new Date()
}

useIntervalFn(updateTime, 1000)
updateTime()
</script>