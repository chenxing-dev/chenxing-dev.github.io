<script setup lang="ts">
import type { CSSProperties } from 'vue';

// Subtle noise overlay
const noiseOverlay = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.05' numOctaves='4' stitchTiles='titch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E %3CfeComponentTransfer%3E %3CfeFuncR type='table' tableValues='[amount] (1 - [amount])'/%3E%3CfeFuncG type='table' tableValues='[amount] (1 - [amount])'/%3E%3CfeFuncB type='table' tableValues='[amount] (1 - [amount])'/%3E%3C/feComponentTransfer%3E  %3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.25'/%3E%3C/svg%3E\")";

const textureStyle: CSSProperties = {
    backgroundImage: noiseOverlay,
    backgroundSize: 'cover',
};
</script>

<template>
    <div class="absolute inset-0 z-0 bg-zinc-50">
        <div class="absolute inset-0" :style="textureStyle">
            <div class="absolute inset-0 bg-zinc-50/40"></div>
        </div>
    </div>
</template>



<style></style>