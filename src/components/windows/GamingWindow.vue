<template>
  <div class="flex-1 overflow-auto p-4">
    <!-- Empty State -->
    <div v-if="games.length === 0" class="h-full flex flex-col items-center justify-center text-center p-8">
      <div class="w-32 h-32 mb-4 text-zinc-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <h3 class="text-xl font-bold text-zinc-700 mb-2">No Games Available</h3>
      <p class="text-zinc-500 max-w-md">It looks like there are no games in the collection yet.</p>
      <p class="text-zinc-500 max-w-md">Check back later!</p>
    </div>

    <!-- Game Grid (when games exist) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="game in games" :key="game.id" class="overflow-hidden bg-zinc-100 border border-zinc-600 transform transition-all duration-300 hover:shadow-xl p-2">
        <!-- Game Thumbnail -->
        <div class="relative h-64 overflow-hidden bg-zinc-900">
          <div class="w-full h-full bg-cover bg-center" :style="{ backgroundImage: `url(${game.thumbnail})` }"></div>

          <!-- Game Title -->
          <div class="absolute bottom-0 left-0 w-full bg-zinc-800/80 px-4 py-1 flex items-center justify-between">
            <div>
              <h3 class="text-xl font-bold text-zinc-100 font-mono">
                {{ game.title }}
              </h3>
              <div class="flex items-center text-sm text-zinc-300 mb-1">
                <span>{{ game.genre }}</span>
              </div>
            </div>

            <!-- Play Button -->
            <button class="w-8 h-8 rounded-full bg-zinc-300 flex items-center justify-center hover:bg-zinc-200 hover:scale-[1.2] transition-all cursor-pointer" @click="playGame(game)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-zinc-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Game Details -->
        <div class="p-2">
          <p class="text-zinc-600 text-sm mb-2">{{ game.description }}</p>

          <!-- Tech Tags -->
          <div class="flex flex-wrap gap-2">
            <span v-for="(tech, index) in game.tech" :key="index" class="px-2 py-1 bg-zinc-300 rounded-full text-xs text-zinc-800 leading-tight">
              {{ tech }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { games, type Game } from "../../config/games.ts";
import useWindowManager from "../useWindowManager.ts";

const { openWindow } = useWindowManager();

// Play game function - creates a new window to play the game
const playGame = (game: Game) => {
  openWindow(game.id);
};
</script>

<style></style>
