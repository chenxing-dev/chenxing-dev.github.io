<script setup lang="ts">
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
    <div class="icon-container mb-1 w-12 h-12 flex items-center justify-center rounded-lg bg-white/10 group-hover:bg-zinc-500/30 transition-colors">
      <span class="text-2xl">{{ icon }}</span>
    </div>
    <span class="text-xs text-zinc-500 px-1 py-0.5 rounded transition-colors text-center">
      {{ label }}
    </span>
  </div>
</template>
