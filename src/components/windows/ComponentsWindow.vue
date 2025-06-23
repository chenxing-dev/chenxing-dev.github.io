<script lang="ts" setup>
import { ref } from "vue";
import ParticleText from "./components/ParticleText.vue";
import MusicPlayer from "./components/MusicPlayer.vue";
import FluidToggle from "./components/FluidToggle.vue";

const activeTab = ref(0);
const tabs = ref(["Particle Text", "Music Player", "Fluid Toggle"]);

const activateTab = (index: number) => {
  activeTab.value = index;
};
</script>
<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!-- Tabs -->
    <div class="flex border-b border-zinc-200">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        @click="activateTab(index)"
        class="px-4 py-2 text-sm font-medium transition-all duration-300 relative"
        :class="{
          'text-zinc-600': activeTab === index,
          'text-zinc-400 hover:text-zinc-700': activeTab !== index
        }"
      >
        {{ tab }}
        <span v-if="activeTab === index" class="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-700"></span>
      </button>
    </div>

    <!-- Component Showcase Area -->
    <div class="flex-1 p-4 overflow-auto bg-gradient-to-br from-zinc-50 to-zinc-100">
      <div v-show="activeTab === 1" class="flex items-center justify-center h-full">
        <MusicPlayer />
      </div>

      <div v-show="activeTab === 0" class="flex flex-col items-center justify-center h-full">
        <ParticleText text="陈刑OS" fontSize="80" :color-palette="['#a1a1aa', '#71717a', '#d6d3d1', '#44403c', '#0c0a09']" />
      </div>

      <div v-show="activeTab === 2" class="flex flex-col items-center justify-center h-full">
        <FluidToggle />
      </div>
    </div>

    <!-- Status Bar -->
    <div class="flex items-center justify-between px-3 py-1 text-xs text-zinc-600 bg-zinc-50/90 border-t border-zinc-200">
      <div>Components v1.0</div>
      <div>Ready</div>
    </div>
  </div>
</template>
