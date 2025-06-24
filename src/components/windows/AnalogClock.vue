<template>
  <div class="relative h-full p-2 aspect-square mx-auto">
    <div class="relative w-full h-full border-1 border-dashed border-zinc-900 rounded-full">
      <!-- Hour markings -->
      <div v-for="hour in 12" :key="`hour-${hour}`" class="hour-mark absolute top-1/2 left-1/2 w-1 h-48 bg-zinc-700 translate-x-1/2 -translate-y-1/2 -ml-1" :style="{ transform: `rotate(${hour * 30}deg)` }"></div>
      <!-- Minute markings -->
      <div v-for="minute in 60" :key="`minute-${minute}`" class="minute-mark" :style="{ transform: `rotate(${minute * 6}deg)` }"></div>
      <!-- Center dot -->
      <div class="center-dot absolute w-[200px] h-[200px] rounded-full bg-zinc-50 top-1/2 left-1/2 translate-x-1/2 -translate-y-1/2 -ml-1"></div>

      <!-- Clock hands -->
      <div class="absolute bottom-1/2 left-1/2 origin-bottom-center bg-zinc-900 w-2 h-12 rounded -translate-x-1/2" :style="{ transform: `rotate(${hourRotation}deg)` }"></div>
      <div class="absolute bottom-1/2 left-1/2 origin-bottom-center bg-zinc-900 w-1 h-16 rounded -translate-x-1/2" :style="{ transform: `rotate(${minuteRotation}deg)` }"></div>
      <div class="absolute bottom-1/2 left-1/2 origin-bottom-center bg-zinc-900 w-0.5 h-20 rounded -translate-x-1/2" :style="{ transform: `rotate(${secondRotation}deg)` }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useIntervalFn } from "@vueuse/core";

const now = ref(new Date());

// Update time every second
const updateTime = () => {
  now.value = new Date();
};

useIntervalFn(updateTime, 1000);
updateTime();

// Calculate rotation angles
const hourRotation = computed(() => {
  const hours = now.value.getHours() % 12;
  const minutes = now.value.getMinutes();
  return hours * 30 + minutes * 0.5; // 30° per hour + 0.5° per minute
});

const minuteRotation = computed(() => {
  return now.value.getMinutes() * 6; // 6° per minute
});

const secondRotation = computed(() => {
  return now.value.getSeconds() * 6; // 6° per second
});
</script>
