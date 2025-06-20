<template>
  <div class="gaming-grid">
    <div v-for="(game, index) in games" :key="index" class="game-card">
      <img :src="game.thumbnail" alt="Game thumbnail" />
      <div class="title">{{ game.title }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const games = [
  { title: "Pixel Quest", thumbnail: "/assets/pixel-quest.png" },
  { title: "Cyber Runner", thumbnail: "/assets/cyber-runner.png" }
  // ... 15 total entries
];
</script>

<style>
.gaming-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  padding: 12px;
}

.game-card {
  transition: transform 0.2s;
}

.game-card:hover {
  transform: scale(1.05);
}
</style>
