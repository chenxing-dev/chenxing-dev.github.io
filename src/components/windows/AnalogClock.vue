<template>
  <div class="relative h-full p-2 aspect-square mx-auto">
    <div class="relative w-full h-full border-1 border-dashed border-zinc-900 rounded-full">
      <div class="absolute bottom-[50%] left-[49%] origin-bottom-center bg-zinc-900 w-2 h-12 rounded" :style="{ transform: `rotate(${hourRotation}deg)` }"></div>
      <div class="absolute bottom-[50%] left-[50%] origin-bottom-center bg-zinc-900 w-1 h-16 rounded" :style="{ transform: `rotate(${minuteRotation}deg)` }"></div>
      <div class="absolute bottom-[50%] left-[51%] origin-bottom-center bg-zinc-900 w-0.5 h-20 rounded" :style="{ transform: `rotate(${secondRotation}deg)` }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";

const now = ref(new Date());

// Update time every second
let timer: number;
onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});

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
