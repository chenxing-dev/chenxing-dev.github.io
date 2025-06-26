<script setup lang="ts">
import { useSettings } from "../useSettings";

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
    <div class="logo-text-wrapper absolute right-8 bottom-4 font-serif font-bold text-zinc-800">
      <div class="fold absolute w-[110%] h-1 bg-zinc-800/10 top-[75%] -left-[10%] rotate-8"></div>
      <div class="fold absolute w-[110%] h-1 bg-zinc-700/20 top-[65%] -left-[4%] -rotate-10"></div>
      <div class="fold absolute w-[115%] h-1 bg-zinc-700/10 top-[35%] -right-[10%] rotate-6"></div>
      <div class="logo-text text-8xl tracking-tighter flex">
        <!-- 每个字符单独控制 -->
        <div class="character chinese scale-y-95">
          <span>陈</span>
        </div>
        <div class="character chinese scale-y-95">
          <span>刑</span>
        </div>
        <div class="character english min-w-[0.9em] -mx-[0.05em] origin-left scale-x-120 scale-y-101">
          <span>O</span>
        </div>
        <div class="character english min-w-[0.9em]-mx-[0.05em] origin-left scale-x-120 scale-y-101">
          <span>S</span>
        </div>
      </div>
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
  .fold {
    display: none;
  }
  .logo-text-wrapper {
    color: #fcfcfc;
  }
  .logo-text-wrapper::before {
    content: "";
    display: block;
    position: absolute;
    left: -10px;
    width: 400px;
    height: 105px;
    background-color: #232323;
  }
}

.bg-paper {
  .background {
    background-color: #f5f0e6;
    background-image: linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
    background-size: 20px 20px;
  }
}

.logo-text-wrapper {
  text-shadow: 0 8px 4px rgba(0, 0, 0, 0.2);
}
</style>
