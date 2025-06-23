<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type Ref } from "vue";

// Audio file paths
const audioFiles = {
  gymnopedie1: '/audio/gymnopedie_no1.mp3',
}

type Song = {
  id: number,
  title: string,
  artist: string,
  duration: string,
  color: string,
  file: string
}

// Playlist data
const playlist: Ref<Song[]> = ref([
  {
    id: 1,
    title: "Gymnopédie No.1",
    artist: "Erik Satie, Eric Billingsley",
    duration: "3:32",
    color: "#3f3f46",
    file: audioFiles.gymnopedie1
  }
]);

const currentTrackIndex = ref(0);
const isPlaying = ref(false);
const progress = ref(0);
const audioRef = ref<HTMLAudioElement | null>(null)
const currentTime = ref(0)
const duration = ref(0)
const isSeeking = ref(false)

const currentTrack = computed(() => playlist.value[currentTrackIndex.value]);

const togglePlay = () => {
  if (!audioRef.value) return

  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play().catch(error => {
      console.error("Audio playback failed:", error)
    })
  }
  isPlaying.value = !isPlaying.value
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}
const nextTrack = () => {
  currentTrackIndex.value = (currentTrackIndex.value + 1) % playlist.value.length
  progress.value = 0
  if (audioRef.value) {
    audioRef.value.currentTime = 0
    audioRef.value.play().then(() => {
      isPlaying.value = true
    })
  }
}

const prevTrack = () => {
  currentTrackIndex.value = (currentTrackIndex.value - 1 + playlist.value.length) % playlist.value.length
  progress.value = 0
  if (audioRef.value) {
    audioRef.value.currentTime = 0
    audioRef.value.play().then(() => {
      isPlaying.value = true
    })
  }
}
const setProgress = (e: MouseEvent) => {
  if (!audioRef.value || !duration.value) return
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const pos = (e.clientX - rect.left) / rect.width
  const newTime = pos * duration.value
  audioRef.value.currentTime = newTime
}

// Handle audio events
const onTimeUpdate = () => {
  if (!audioRef.value || isSeeking.value) return
  currentTime.value = audioRef.value.currentTime
  progress.value = (currentTime.value / duration.value) * 100
}

const onLoadedMetadata = () => {
  if (!audioRef.value) return
  duration.value = audioRef.value.duration
}

const onEnded = () => {
  nextTrack()
}

// Handle keyboard shortcuts
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.code === 'Space') {
    e.preventDefault()
    togglePlay()
  } else if (e.code === 'ArrowRight') {
    e.preventDefault()
    if (audioRef.value) {
      audioRef.value.currentTime = Math.min(audioRef.value.currentTime + 5, duration.value)
    }
  } else if (e.code === 'ArrowLeft') {
    e.preventDefault()
    if (audioRef.value) {
      audioRef.value.currentTime = Math.max(audioRef.value.currentTime - 5, 0)
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  if (audioRef.value) {
    audioRef.value.pause()
  }
})
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <div class="w-full h-full flex flex-col justify-center">
      <!-- Audio element -->
      <audio ref="audioRef" :src="currentTrack.file" @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata"
        @ended="onEnded"></audio>

      <!-- Track Info -->
      <div class="px-4">
        <div class="mb-4">
          <h2 class="text-xl font-bold text-zinc-700">{{ currentTrack.title }}</h2>
          <p class="text-zinc-600">{{ currentTrack.artist }}</p>
        </div>

        <!-- Progress Bar -->
        <div class="mb-4">
          <div class="flex justify-between text-zinc-500">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ currentTrack.duration }}</span>
          </div>
          <div class="h-1.5 bg-zinc-300 rounded-full overflow-hidden cursor-pointer" @click="setProgress"
            @mousedown="isSeeking = true" @mouseup="isSeeking = false">
            <div class="h-full transition-all duration-300" :style="{
              width: progress + '%',
              backgroundColor: currentTrack.color
            }"></div>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex items-center justify-center space-x-8 mb-4">
          <button class="w-8 h-8 text-zinc-500 hover:text-zinc-700 transition-colors" @click="prevTrack">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>

          <button
            class="w-14 h-14 rounded-full flex items-center justify-center text-zinc-50 shadow-lg transition-all hover:scale-105"
            :style="{ backgroundColor: currentTrack.color }" @click="togglePlay">
            <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <button class="w-8 h-8 text-zinc-500 hover:text-zinc-700 transition-colors" @click="nextTrack">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>

      </div>

      <!-- Playlist -->
      <div class="border-t border-zinc-400 max-h-48 overflow-y-auto">
        <div v-for="(track, index) in playlist" :key="track.id"
          class="flex items-center p-2 border-b border-zinc-300/50 hover:bg-zinc-100 cursor-pointer transition-colors"
          :class="{ 'bg-zinc-50': currentTrackIndex === index }"
          @click="currentTrackIndex = index; if (isPlaying) audioRef?.play()">
          <div class="w-10 h-10 mr-2 flex items-center justify-center" :style="{ backgroundColor: track.color + '20' }">
            <div v-if="currentTrackIndex === index && isPlaying" class="flex space-x-1">
              <div class="w-1 h-3 bg-zinc-500 animate-pulse" style="animation-delay: 0ms"></div>
              <div class="w-1 h-3 bg-zinc-500 animate-pulse" style="animation-delay: 300ms"></div>
              <div class="w-1 h-3 bg-zinc-500 animate-pulse" style="animation-delay: 600ms"></div>
            </div>
            <div v-else class="text-zinc-500">{{ index + 1 }}</div>
          </div>
          <div class="flex-1">
            <div :class="{ 'text-zinc-600': currentTrackIndex === index }">{{ track.title }}
            </div>
            <div class="text-xs text-zinc-500">{{ track.artist }}</div>
          </div>
          <div class="text-xs text-zinc-500">{{ track.duration }}</div>
        </div>
      </div>
    </div>
    <!-- Keyboard Hint -->
    <div class="bg-zinc-100 p-2 text-center text-xs text-zinc-500 border-t border-zinc-300">
      <span class="inline-block bg-zinc-50 border border-zinc-300 px-2 py-1 rounded mr-2 shadow">Space</span> Play/Pause
      <span class="inline-block bg-zinc-50 border border-zinc-300 px-2 py-1 rounded mx-2 shadow">←</span> Rewind
      <span class="inline-block bg-zinc-50 border border-zinc-300 px-2 py-1 rounded ml-2 shadow">→</span> Forward
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
