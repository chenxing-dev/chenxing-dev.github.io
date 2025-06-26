<script setup lang="ts">
import { useSettings } from "../useSettings";

const { settings } = useSettings();

defineProps<{
  icon: string;
  label: string;
  type: string;
}>();

const emit = defineEmits<{
  (e: "open", type: string): void;
}>();
</script>

<template>
  <div class="desktop-icon group flex flex-col items-center p-2 w-16 cursor-pointer transition-all" @dblclick="emit('open', type)">
    <div class="icon-container mb-1 w-12 h-12 flex items-center justify-center rounded-lg group-hover:scale-[1.2] transition-all duration-300">
      <span class="text-2xl text-shadow-lg">{{ icon }}</span>
    </div>
    <span class="text-xs text-zinc-500 px-1 py-0.5 rounded transition-colors text-center text-shadow-lg" :class="settings.background">
      {{ label }}
    </span>
  </div>
</template>
<style scoped>
.bg-sky-blue {
  color: #151c26;
}
</style>
