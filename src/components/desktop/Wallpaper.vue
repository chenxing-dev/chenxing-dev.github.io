<script setup lang="ts">

const textureStyle = {
    backgroundImage: `
linear-gradient(to bottom right, var(--tissue-light), var(--tissue-dark)),
url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'
    viewBox='0 0 400 400'><path fill='none' stroke='rgba(0,0,0,0.03)' stroke-width='1.5' d='M50,50 C100,30 150,70 180,130 C210,190 250,180 300,200 C350,220 370,170 370,120'/><path fill='none' stroke='rgba(0,0,0,0.03)' stroke-width='1.5' d='M80,300 C120,250 180,270 220,220 C260,170 300,200 340,240'/><path fill='none' stroke='rgba(0,0,0,0.03)' stroke-width='1.5' d='M20,200 C60,160 100,220 140,180'/></svg>")
`,
    backgroundBlendMode: 'overlay',
    backgroundSize: 'cover, 400px 400px',
    opacity: '0.9',
    filter: 'brightness(1.1) contrast(1.1)'
}
</script>

<template>
    <div class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-tissue-base" :style="textureStyle">
        </div>
    </div>
</template>



<style>
.bg-tissue-base {
    background: linear-gradient(to bottom right, var(--tissue-light), var(--tissue-dark));
}
</style>