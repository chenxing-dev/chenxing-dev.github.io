<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/style.css";
import gsap from "gsap";
import { useFocus } from "@vueuse/core";
import useWindowManager, { type WindowItem } from "../../composables/useWindowManager.ts";
import { getComponentByType } from "../../config/app.ts";
import { useMobileDetector } from "../../composables/useMobileDetector.ts";
import { useSettings } from "../../composables/useSettings.ts";

const { settings } = useSettings();

const props = defineProps<{
  window: WindowItem;
}>();

const emit = defineEmits<{
  (e: "close", id: number): void;
  (e: "focus", id: number): void;
}>();

const { isMobile } = useMobileDetector();

const { updateWindowState } = useWindowManager();

// Local state for drag position
const position = ref({
  x: props.window.position.x,
  y: props.window.position.y
});

// Handle drag events
const onDrag = (x: number, y: number) => {
  position.value = { x, y };
};

// Handle drag end - update persistent state
const onDragStop = () => {
  updateWindowState(props.window.id, position.value);
};

// Focus management
const windowRef = ref<HTMLElement | null>(null);
const { focused } = useFocus(windowRef, { initialValue: true });

watch(focused, isFocused => {
  if (isFocused) {
    emit("focus", props.window.id);
  }
});

// Animation on mount
onMounted(() => {
  gsap.from(windowRef.value, {
    scale: 0.1,
    opacity: 0,
    duration: 0.3,
    ease: "back.out(1.7)"
  });
});

// Window title
const title = props.window.title || "Untitled Window";

// Current window content
const contentComponent = computed(() => {
  const component = getComponentByType(props.window.type);
  if (component) {
    return component;
  }
  return null;
});
</script>

<template>
  <VueDraggableResizable class="window bg-transparent max-w-dvw"
    :class="isMobile ? (window.mobileSize?.height ? '' : '!h-dvh !max-h-full') : ''" :draggable="!isMobile"
    :resizable="false" :drag-handle="'.drag-handle'" :x="isMobile ? 0 : window.position.x"
    :y="isMobile ? 0 : window.position.y" :w="window.size.width"
    :h="isMobile ? window.mobileSize?.height : window.size.height" :z="window.zIndex" @dragging="onDrag"
    @drag-stop="onDragStop" @activated="emit('focus', window.id)">
    <div ref="windowRef" :class="settings.theme"
      class="bg-zinc-50 bg-primary border-2 border-accent overflow-hidden flex flex-col md:w-full h-full p-0.5 m-2"
      @mousedown="emit('focus', window.id)">
      <!-- Title Bar -->
      <div
        class="title-bar drag-handle flex items-center justify-between md:cursor-grab border-2 border-b-0 border-accent h-6 bg-title-bar">
        <div class="flex items-center mx-auto">
          <span class="text-sm font-medium truncate max-w-[200px]">{{ title }}</span>
        </div>
        <div class="flex items-center border-l-2 border-accent h-full">
          <button :class="settings.theme"
            class="close-btn w-5 h-5 flex items-center justify-center hover:bg-zinc-100/80 cursor-pointer"
            @click.stop="emit('close', window.id)">
            <div class="w-3 h-0.5 bg-accent rotate-45 absolute"></div>
            <div class="w-3 h-0.5 bg-accent -rotate-45 absolute"></div>
          </button>
        </div>
      </div>

      <!-- Window Content -->
      <div class="window-content flex-1 overflow-auto border-2 border-accent">
        <component :is="contentComponent" v-if="contentComponent" :type="window.type" />
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
