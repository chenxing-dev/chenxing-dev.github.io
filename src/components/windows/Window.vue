<script lang="ts" setup>
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/style.css";

import { computed } from "vue";
import { useMobileDetector } from "@/composables/useMobileDetector.ts";
import { useSettings } from "@/composables/useSettings.ts";
import { useWindowInstance } from "@/composables/useWindowInstance";
import { type WindowItem } from "@/composables/useDesktop";

const props = defineProps<{ window: WindowItem }>();
const emit = defineEmits<{
  (e: "close", id: number): void;
  (e: "focus", id: number): void;
}>();

const { settings } = useSettings();
const { isMobile } = useMobileDetector();

const {
  windowRef,
  position,
  title,
  contentComponent,
  onDrag,
  onDragStop,
  onMousedown,
  handleClose,
  focus
} = useWindowInstance(props.window, emit);


// Computed dimensions
const width = computed(() => props.window.app.size.width);
const height = computed(() => isMobile.value ? (props.window.app.mobileSize?.height || props.window.app.size.height) : props.window.app.size.height);
</script>

<template>
  <VueDraggableResizable class="window bg-transparent max-w-dvw"
    :class="isMobile ? (window.app.mobileSize?.height ? '' : '!h-dvh !max-h-full') : ''" :draggable="!isMobile"
    :resizable="false" :drag-handle="'.drag-handle'" :x="isMobile ? 0 : position.x" :y="isMobile ? 0 : position.y"
    :w="width" :h="height" :z="window.zIndex" @dragging="onDrag" @drag-stop="onDragStop" @activated="focus">
    <div ref="windowRef" :class="settings.theme"
      class="bg-zinc-50 bg-primary border-2 border-accent overflow-hidden flex flex-col md:w-full h-full p-0.5 m-2"
      @mousedown="onMousedown">
      <!-- Title Bar -->
      <div
        class="title-bar drag-handle flex items-center justify-between md:cursor-grab border-2 border-b-0 border-accent h-6 bg-title-bar">
        <div class="flex items-center mx-auto">
          <span class="text-sm font-medium truncate max-w-[200px]">{{ title }}</span>
        </div>
        <div class="flex items-center border-l-2 border-accent h-full">
          <button :class="settings.theme"
            class="close-btn w-5 h-5 flex items-center justify-center hover:bg-zinc-100/80 cursor-pointer"
            @click.stop="handleClose">
            <div class="w-3 h-0.5 bg-accent rotate-45 absolute"></div>
            <div class="w-3 h-0.5 bg-accent -rotate-45 absolute"></div>
          </button>
        </div>
      </div>

      <!-- Window Content -->
      <div class="window-content flex-1 overflow-auto border-2 border-accent">
        <component :is="contentComponent" v-if="contentComponent" :type="window.app.type" />
        <div v-else class="h-full flex items-center justify-center text-zinc-400">Window content not available</div>
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

.window-content {
  scrollbar-color: #71717a #e4e4e7;
  scrollbar-width: thin;
}
</style>
