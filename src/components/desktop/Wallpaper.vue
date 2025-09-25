<script setup lang="ts">
import { useSettings } from "../../composables/useSettings";

const { settings } = useSettings();
</script>

<template>
  <div :class="settings.background">
    <div class="background absolute inset-0 z-0"></div>
    <div class="decoration absolute w-full h-full">
      <div class="corner absolute w-8 h-8 top-2 left-2 border-t-2 border-l-2 border-zinc-400"></div>
      <div class="corner absolute w-8 h-8 top-2 right-2 border-t-2 border-r-2 border-zinc-400"></div>
      <div class="corner absolute w-8 h-8 bottom-2 left-2 border-b-2 border-l-2 border-zinc-400"></div>
      <div class="corner absolute w-8 h-8 bottom-2 right-2 border-b-2 border-r-2 border-zinc-400"></div>
    </div>
  </div>
</template>

<style scoped>
.bg-off-white {
  .background {
    background-color: #fafafa;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.05' numOctaves='4' stitchTiles='titch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E %3CfeComponentTransfer%3E %3CfeFuncR type='table' tableValues='[amount] (1 - [amount])'/%3E%3CfeFuncG type='table' tableValues='[amount] (1 - [amount])'/%3E%3CfeFuncB type='table' tableValues='[amount] (1 - [amount])'/%3E%3C/feComponentTransfer%3E  %3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.25'/%3E%3C/svg%3E");
  }

  /* 纹理背景 */
  .background::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(circle at 55% 20%, rgba(164, 164, 164, 0.1) 0%, transparent 25%), radial-gradient(circle at 80% 40%, rgba(164, 164, 164, 0.1) 0%, transparent 15%), radial-gradient(circle at 30% 70%, rgba(164, 164, 164, 0.1) 0%, transparent 20%), linear-gradient(to bottom, rgba(233, 233, 233, 0.2) 0%, transparent 30%), repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.02) 0px, rgba(0, 0, 0, 0.02) 1px, transparent 1px, transparent 20px);
    background-size: 600px 600px, 600px 600px, 600px 600px, 100% 100%, 20px 20px;
    opacity: 0.9;
    z-index: 0;
    pointer-events: none;
  }
}

.bg-sand {
  .background {
    background-color: #f4deb9;
  }
}

.bg-sky-blue {
  .background {
    background-color: #92c1d3;
  }

  .corner {
    border-color: #232323;
  }
}

.bg-paper {
  .background {
    background-color: #f5f0e6;
    background-image: linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
    background-size: 20px 20px;
  }
}
</style>
