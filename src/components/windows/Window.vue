<script lang="ts" setup>
import { computed, defineAsyncComponent, markRaw, onMounted, ref, watch } from 'vue'
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/style.css";
import gsap from "gsap";
import { useFocus } from '@vueuse/core'
import type { WindowItem } from '../useWindowManager.ts'

const props = defineProps<{
  window: WindowItem
}>()

const emit = defineEmits<{
  (e: 'close', id: number): void
  (e: 'focus', id: number): void
}>()

// Dynamic window content components
const windowComponents: Record<string, any> = {
  gaming: defineAsyncComponent(() => import('./GamingWindow.vue')),
  terminal: defineAsyncComponent(() => import('./TerminalWindow.vue')),
  scripts: defineAsyncComponent(() => import('./ScriptsWindow.vue')),
  code_projects: defineAsyncComponent(() => import('./ProjectsWindow.vue')),
  about_me: defineAsyncComponent(() => import('./AboutWindow.vue')),
  contact: defineAsyncComponent(() => import('./ContactWindow.vue')),
  clock: defineAsyncComponent(() => import('./ClockWindow.vue')),
  settings: defineAsyncComponent(() => import('./SettingsWindow.vue'))
}

// Window titles
const windowTitles: Record<string, string> = {
  gaming: '🎮 Gaming Library',
  terminal: '🐧 Terminal',
  scripts: '📜 Scripting Demos',
  code_projects: '💻 Code Projects',
  about_me: '👤 About Me',
  contact: '✉️ Contact',
  clock: '🕒 Clock',
  settings: '⚙️ System Settings'
}

// Focus management
const windowRef = ref<HTMLElement | null>(null)
const { focused } = useFocus(windowRef, { initialValue: true })

watch(focused, (isFocused) => {
  if (isFocused) {
    emit('focus', props.window.id)
  }
})

// Animation on mount
onMounted(() => {
  gsap.from(windowRef.value, {
    scale: 0.8,
    opacity: 0,
    duration: 0.3,
    ease: 'back.out(1.7)'
  })
})

// Current window content
const contentComponent = computed(() => {
  return markRaw(windowComponents[props.window.type] || null)
})

// Window title
const title = computed(() => {
  return windowTitles[props.window.type] || 'Untitled Window'
})
</script>

<template>
  <VueDraggableResizable :x="window.position.x" :y="window.position.y" :w="window.size.width" :h="window.size.height"
    :z="window.zIndex" :min-width="300" :min-height="200" :draggable="true" :resizable="false"
    @activated="emit('focus', window.id)" class="window-container">
    <div ref="windowRef" class="window bg-gray-800 rounded overflow-hidden flex flex-col w-full h-full"
      @mousedown="emit('focus', window.id)">
      <!-- Title Bar -->
      <div
        class="title-bar flex items-center justify-between px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-800 text-white cursor-move">
        <div class="flex items-center">
          <span class="mr-2">{{ title.charAt(0) }}</span>
          <span class="text-sm font-medium truncate max-w-[200px]">{{ title.slice(1) }}</span>
        </div>
        <div class="flex items-center space-x-2">
          <button class="close-btn w-5 h-5 flex items-center justify-center rounded hover:bg-red-500"
            @click.stop="emit('close', window.id)">
            <div class="w-2.5 h-0.5 bg-white rotate-45 absolute"></div>
            <div class="w-2.5 h-0.5 bg-white -rotate-45 absolute"></div>
          </button>
        </div>
      </div>

      <!-- Window Content -->
      <div class="window-content flex-1 overflow-auto bg-gray-900/80 p-4">
        <component :is="contentComponent" v-if="contentComponent" />
        <div v-else class="h-full flex items-center justify-center text-gray-400">
          Window content not available
        </div>
      </div>
    </div>
  </VueDraggableResizable>
</template>



<style scoped>
.window {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.title-bar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  user-select: none;
}

.window-content {
  scrollbar-width: thin;
  scrollbar-color: rgba(100, 100, 100, 0.4) transparent;
}

.minimize-btn,
.close-btn {
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: #e53e3e !important;
}
</style>
