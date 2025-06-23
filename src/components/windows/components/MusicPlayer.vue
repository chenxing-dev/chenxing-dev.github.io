<script setup lang="ts">
import { ref, computed } from "vue";

// Simulated playlist data
const playlist = ref([
  {
    id: 1,
    title: "Morning Coffee",
    artist: "LoFi Beats",
    duration: "3:42",
    cover: "morning-coffee",
    color: "#d4b483"
  },
  {
    id: 2,
    title: "Rainy Window",
    artist: "Ambient Piano",
    duration: "4:15",
    cover: "rainy-window",
    color: "#a0c1d1"
  },
  {
    id: 3,
    title: "Forest Walk",
    artist: "Nature Sounds",
    duration: "5:28",
    cover: "forest-walk",
    color: "#a0b4a6"
  },
  {
    id: 4,
    title: "Evening Tea",
    artist: "Jazz Vibes",
    duration: "3:56",
    cover: "evening-tea",
    color: "#c6a1a8"
  }
]);

const currentTrackIndex = ref(0);
const isPlaying = ref(false);
const progress = ref(0);
const volume = ref(80);
const elapsedTime = ref("0:00");
const totalTime = ref("0:00");

const currentTrack = computed(() => playlist.value[currentTrackIndex.value]);
const progressStyle = computed(() => ({ width: `${progress.value}%` }));
const volumeStyle = computed(() => ({ width: `${volume.value}%` }));

const togglePlay = () => {
  isPlaying.value = !isPlaying.value;
  // Simulate progress for demo
  if (isPlaying.value) {
    simulateProgress();
  }
};

const simulateProgress = () => {
  if (isPlaying.value && progress.value < 100) {
    setTimeout(() => {
      progress.value += 0.5;
      elapsedTime.value = formatTime((progress.value / 100) * parseInt(currentTrack.value.duration.replace(":", "")) * 100);
      simulateProgress();
    }, 100);
  } else if (progress.value >= 100) {
    nextTrack();
  }
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const nextTrack = () => {
  currentTrackIndex.value = (currentTrackIndex.value + 1) % playlist.value.length;
  progress.value = 0;
  isPlaying.value = true;
  simulateProgress();
};

const prevTrack = () => {
  currentTrackIndex.value = (currentTrackIndex.value - 1 + playlist.value.length) % playlist.value.length;
  progress.value = 0;
  isPlaying.value = true;
  simulateProgress();
};

const setVolume = (e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const pos = (e.clientX - rect.left) / rect.width;
  volume.value = Math.min(100, Math.max(0, Math.round(pos * 100)));
};

const setProgress = (e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const pos = (e.clientX - rect.left) / rect.width;
  progress.value = Math.min(100, Math.max(0, Math.round(pos * 100)));
};

// Initialize total time
totalTime.value = currentTrack.value.duration;
</script>

<template>
  <div class="w-full max-w-md rounded-xl overflow-hidden shadow-lg">
    <!-- Album Art with Soft Shadow -->
    <div class="relative h-64 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-[#d4b483] to-[#a0c1d1] opacity-80"></div>
      <div class="absolute inset-4 rounded-xl bg-white/30 backdrop-blur-sm border border-white/30"></div>
      <div class="absolute inset-8 rounded-xl flex items-center justify-center">
        <div class="w-40 h-40 rounded-full overflow-hidden border-4 border-white/50 shadow-lg">
          <div class="w-full h-full flex items-center justify-center" :style="{ backgroundColor: currentTrack.color + '30' }">
            <div class="text-5xl">♪</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Track Info -->
    <div class="p-6 bg-white/90 backdrop-blur-sm">
      <div class="text-center mb-6">
        <h2 class="text-xl font-bold text-[#6a8b9c]">{{ currentTrack.title }}</h2>
        <p class="text-gray-600">{{ currentTrack.artist }}</p>
      </div>

      <!-- Progress Bar -->
      <div class="mb-4">
        <div class="flex justify-between text-xs text-gray-500 mb-1">
          <span>{{ elapsedTime }}</span>
          <span>{{ totalTime }}</span>
        </div>
        <div class="h-1.5 bg-[#d8e3f0] rounded-full overflow-hidden cursor-pointer" @click="setProgress">
          <div
            class="h-full rounded-full transition-all duration-300"
            :style="{
              width: progress + '%',
              backgroundColor: currentTrack.color
            }"
          ></div>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex items-center justify-center space-x-8 mb-6">
        <button class="w-8 h-8 flex items-center justify-center text-[#6a8b9c] hover:text-[#8ba6ac] transition-colors" @click="prevTrack">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>

        <button class="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-105" :style="{ backgroundColor: currentTrack.color }" @click="togglePlay">
          <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        <button class="w-8 h-8 flex items-center justify-center text-[#6a8b9c] hover:text-[#8ba6ac] transition-colors" @click="nextTrack">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Volume Control -->
      <div class="flex items-center space-x-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#6a8b9c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072M12 6a9 9 0 010 12m-4.5-9.5L12 3l4.5 4.5M12 2v2" />
        </svg>
        <div class="flex-1 h-1.5 bg-[#d8e3f0] rounded-full overflow-hidden cursor-pointer" @click="setVolume">
          <div
            class="h-full rounded-full"
            :style="{
              width: volume + '%',
              backgroundColor: currentTrack.color
            }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Playlist -->
    <div class="bg-white/80 backdrop-blur-sm border-t border-[#d8e3f0] max-h-40 overflow-y-auto">
      <div
        v-for="(track, index) in playlist"
        :key="track.id"
        class="flex items-center p-3 border-b border-[#d8e3f0]/50 hover:bg-[#f0f5ff] cursor-pointer transition-colors"
        :class="{ 'bg-[#f0f5ff]': currentTrackIndex === index }"
        @click="
          currentTrackIndex = index;
          progress = 0;
          isPlaying = true;
        "
      >
        <div class="w-10 h-10 rounded mr-3 flex items-center justify-center" :style="{ backgroundColor: track.color + '20' }">
          <div v-if="currentTrackIndex === index && isPlaying" class="flex space-x-1">
            <div class="w-1 h-3 bg-[#6a8b9c] animate-pulse" style="animation-delay: 0ms"></div>
            <div class="w-1 h-3 bg-[#6a8b9c] animate-pulse" style="animation-delay: 300ms"></div>
            <div class="w-1 h-3 bg-[#6a8b9c] animate-pulse" style="animation-delay: 600ms"></div>
          </div>
          <div v-else class="text-xs text-[#6a8b9c]">{{ index + 1 }}</div>
        </div>
        <div class="flex-1">
          <div class="font-medium text-sm" :class="{ 'text-[#6a8b9c]': currentTrackIndex === index }">{{ track.title }}</div>
          <div class="text-xs text-gray-500">{{ track.artist }}</div>
        </div>
        <div class="text-xs text-gray-500">{{ track.duration }}</div>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes pulse {
  0%,
  100% {
    transform: scaleY(0.5);
  }
  50% {
    transform: scaleY(1);
  }
}
.animate-pulse {
  animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
