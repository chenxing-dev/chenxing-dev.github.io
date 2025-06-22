<script lang="ts" setup>
import { computed, defineAsyncComponent, markRaw, onMounted, ref, watch } from 'vue'
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/style.css";
import gsap from "gsap";
import { useFocus } from '@vueuse/core'
import type { WindowItem } from '../useWindowManager.ts'
import { getWindowTitle, getWindowIcon, getWindowComponent } from '../../config/app.ts'

const props = defineProps<{
  window: WindowItem
}>()

const emit = defineEmits<{
  (e: 'close', id: number): void
  (e: 'focus', id: number): void
}>()


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
    scale: 0.1,
    opacity: 0,
    duration: 0.3,
    ease: 'back.out(1.7)'
  })
})

// Window title
const title = computed(() => getWindowTitle(props.window.type))
const icon = computed(() => getWindowIcon(props.window.type))

// Current window content
const contentComponent = computed(() => getWindowComponent(props.window.type))
</script>

<template>
  <VueDraggableResizable class="window bg-transparent" :draggable="true" :resizable="false"
    :drag-handle="'.drag-handle'" :x="window.position.x" :y="window.position.y" :w="window.size.width"
    :h="window.size.height" :z="window.zIndex" :min-width="300" :min-height="200" @activated="emit('focus', window.id)">
    <div ref="windowRef" class="bg-zinc-50 border-2 border-zinc-950 overflow-hidden flex flex-col w-full h-full p-0.5"
      @mousedown="emit('focus', window.id)">
      <!-- Title Bar -->
      <div class="title-bar drag-handle flex items-center justify-between cursor-grab border-2 border-zinc-950 h-6">
        <div class="flex items-center mx-auto">
          <span class="mr-1">{{ icon }}</span>
          <span class="text-sm font-medium truncate max-w-[200px]">{{ title }}</span>
        </div>
        <div class="flex items-center border-l-2 border-zinc-900 h-full">
          <button class="close-btn w-5 h-5 flex items-center justify-center hover:bg-zinc-300"
            @click.stop="emit('close', window.id)">
            <div class="w-3 h-0.5 bg-zinc-950 rotate-45 absolute"></div>
            <div class="w-3 h-0.5 bg-zinc-950 -rotate-45 absolute"></div>
          </button>
        </div>
      </div>

      <!-- Window Content -->
      <div class="window-content flex-1 overflow-auto p-4 border-2 border-zinc-900">
        <component :is="contentComponent" v-if="contentComponent" />
        <div v-else class="h-full flex items-center justify-center text-zinc-400">
          Window content not available
        </div>
      </div>
    </div>
  </VueDraggableResizable>
</template>



<style>
/* Make sure draggable areas are interactive */
.vdr {
  pointer-events: auto;
  border: none;
}

/* .window {
  border: 1px solid black;
} */

.title-bar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  user-select: none;
}

.window-content {
  scrollbar-width: thin;
  scrollbar-color: rgba(100, 100, 100, 0.4) transparent;
}
</style>
