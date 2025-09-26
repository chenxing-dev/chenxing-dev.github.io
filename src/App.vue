<script setup lang="ts">
import { onMounted } from "vue";
import { useStorage } from "@vueuse/core";

import useDesktop from "@/composables/useDesktop";
import Desktop from "@/components/Desktop.vue";

const { openWindow, } = useDesktop();

onMounted(() => {
  // First run logic
  const firstRun = useStorage("os-first-run", true);

  if (firstRun.value) {
    setTimeout(() => {
      openWindow("projects");
      openWindow("about_me");
      firstRun.value = false;
    }, 2000);
  }
});
</script>

<template>
  <Desktop />
</template>

<style>
@font-face {
  font-family: 'Noto Sans SC';
  font-style: normal;
  font-weight: 400;
  font-stretch: 100%;
  src: url(/fonts/noto-sans-sc-chinese-simplified-400-normal.woff2) format('woff2');
}

@font-face {
  font-family: 'Noto Serif SC';
  font-style: normal;
  font-weight: 900;
  font-stretch: 100%;
  src: url(/fonts/noto-serif-sc-chinese-simplified-900-normal.woff2) format('woff2');
}


:root {
  --font-serif: "Noto Serif SC", sans-serif;
}

.theme-minimal {
  --color-primary: #fafafa;
  --color-secondary: #18181b;
  --color-accent: #09090b;
  --color-title-bar: var(--color-primary);
  --color-selected: #a1a1aa;
}

.theme-cozy {
  --color-primary: #f1e9d6;
  --color-secondary: #373426;
  --color-accent: #645a46;
  --color-title-bar: var(--color-primary);
  --color-selected: #c2a37a;
}

.theme-paper {
  --color-primary: #f6f2ec;
  --color-secondary: #4e4e4e;
  --color-accent: #9c9b96;
  --color-title-bar: var(--color-primary);
  --color-selected: var(--color-accent);
}

.theme-pastel {
  --color-primary: #f3d7d1;
  --color-secondary: #2d1f22;
  --color-accent: #5e524d;
  --color-title-bar: #f7ede3;
  --color-selected: #f58583;
}

.bg-primary {
  background-color: var(--color-primary) !important;
}

.bg-secondary {
  background-color: var(--color-secondary) !important;
}

.bg-accent {
  background-color: var(--color-accent) !important;
}

.text-secondary {
  color: var(--color-secondary) !important;
}

.text-selected {
  color: var(--color-selected) !important;
}

.border-primary {
  border-color: var(--color-primary) !important;
}

.border-accent {
  border-color: var(--color-accent) !important;
}

.bg-title-bar {
  background-color: var(--color-title-bar) !important;
}

.bg-selected {
  background-color: var(--color-selected) !important;
}

body {
  margin: 0;
  font-family: "Noto Sans SC", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
  user-select: none;
}

/* Smooth transitions for layout changes */
.grid {
  transition: grid-template-columns 0.3s ease;
}
</style>
