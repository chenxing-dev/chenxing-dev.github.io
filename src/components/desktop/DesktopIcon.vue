<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  type: string
}>()

const emit = defineEmits<{
  (e: 'open', type: string): void
}>()
</script>

<template>
  <div class="desktop-icon group flex flex-col items-center p-2 w-16 cursor-pointer transition-all"
    @dblclick="console.log('Opening:', type), emit('open', type)">
    <div
      class="icon-container mb-1 w-12 h-12 flex items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm group-hover:bg-blue-500/30 transition-colors">
      <span class="text-2xl">{{ icon }}</span>
    </div>
    <span class="text-xs text-white text-shadow-md px-1 py-0.5 rounded group-hover:bg-blue-500/50 transition-colors">
      {{ label }}
    </span>
  </div>
</template>
<style scoped>
.text-shadow-md {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}
</style>