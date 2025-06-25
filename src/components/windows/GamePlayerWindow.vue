<script setup lang="ts">
import { games, type Game } from "../../config/games.ts";

const props = defineProps<{
  type: string;
}>();

const game: Game | undefined = games.value.find(g => g.id === props.type);
if (!game) {
  throw new Error(`Game with type "${props.type}" not found`);
}
</script>
<template>
  <div class="game-player-window w-full h-full flex flex-col bg-[#111111] items-center justify-center">
    <div class="game-frame flex items-center justify-center" :style="{ width: `${game.width}px`, height: `${game.height}px` }">
      <iframe :src="game.playUrl" frameborder="0" allowfullscreen scrolling="no" class="border-0 outline-none w-full h-full"></iframe>
    </div>
  </div>
</template>
<style scoped>
html,
body {
  height: 100%;
  overflow: auto;
}
body {
  padding: 0;
  margin: 0;
}
#silverlightControlHost {
  height: 100%;
  text-align: center;
}
</style>
