<template>
  <div class="relative h-full p-2 aspect-square mx-auto">
    <div class="relative w-full h-full rounded-full">
      <!-- Hour markings -->
      <div
        v-for="hour in 12"
        :key="`hour-${hour}`"
        class="hour-mark absolute top-1/2 left-1/2 w-1 h-48 bg-accent translate-x-1/2 -translate-y-1/2 -ml-1"
        :style="{ transform: `rotate(${hour * 30}deg)` }"
      ></div>
      <!-- Minute markings -->
      <div
        v-for="minute in 60"
        :key="`minute-${minute}`"
        class="minute-mark absolute top-1/2 left-1/2 w-0.5 h-48 bg-accent translate-x-1/2 -translate-y-1/2 -ml-0.5"
        :style="{ transform: `rotate(${minute * 6}deg)` }"
      ></div>
      <!-- Center dot -->
      <div
        class="center-dot absolute w-[180px] h-[180px] rounded-full bg-primary right-1/2 translate-x-1/2 top-1/2 -translate-y-1/2"
      ></div>

      <!-- Clock hands -->
      <div
        class="absolute bottom-1/2 left-1/2 origin-bottom bg-secondary w-3.5 h-3.5 rounded-full -translate-x-1/2 translate-y-1/2"
      ></div>
      <div
        class="absolute bottom-1/2 left-1/2 origin-bottom w-1 h-20 -translate-x-1/2 border-l-10 border-accent transition duration-300 ease-[cubic-bezier(0.4,1.5,0.3,1)]"
        :style="{
          transform: `rotate(${secondRotation}deg)`,
          clipPath: 'polygon(50% 0, 100% 100%, 0 100%)',
        }"
      ></div>
      <div
        class="absolute bottom-1/2 left-1/2 origin-bottom w-1.5 h-16 -translate-x-1/2 border-l-10 border-accent"
        :style="{
          transform: `rotate(${minuteRotation}deg)`,
          clipPath: 'polygon(50% 0, 110% 110%, 0 110%)',
        }"
      ></div>
      <div
        class="absolute bottom-1/2 left-1/2 origin-bottom w-2 h-12 -translate-x-1/2 border-l-10 border-secondary"
        :style="{
          transform: `rotate(${hourRotation}deg)`,
          clipPath: 'polygon(50% 0, 100% 100%, 0 100%)',
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useIntervalFn } from "@vueuse/core";

// Seed from current wall-clock time so the hands start at the right position.
// Using a monotonically-increasing counter means rotations never wrap back to 0,
// which prevents the CSS transition from animating the wrong (backwards) direction
// when a hand crosses the 12 o'clock position.
const _now = new Date();
const totalSeconds = ref(_now.getHours() * 3600 + _now.getMinutes() * 60 + _now.getSeconds());

useIntervalFn(() => {
  totalSeconds.value++;
}, 1000);

// All angles derived from the ever-growing totalSeconds — never reset
const secondRotation = computed(() => totalSeconds.value * 6);
const minuteRotation = computed(() => (totalSeconds.value / 60) * 6);
const hourRotation = computed(() => (totalSeconds.value / 3600) * 30);
</script>
