<template>
  <VueDraggableResizable v-model:x="position.x" v-model:y="position.y" v-model:w="size.width" v-model:h="size.height" :z="zIndex" @activated="focusWindow(id)">
    <div class="window">
      <div class="title-bar" @mousedown="focusWindow(id)">
        <span>{{ title }}</span>
        <button @click="closeWindow(id)">✕</button>
      </div>
      <div class="content">
        <component :is="contentComponent" />
      </div>
    </div>
  </VueDraggableResizable>
</template>

<script lang="ts" setup>
import { markRaw, onMounted } from "vue";
import VueDraggableResizable from "vue-draggable-resizable";
import gsap from "gsap";
import GamingWindow from "./GamingWindow.vue";
import TerminalWindow from "./TerminalWindow.vue";

interface WindowType {
  title: string;
  component: any;
}

const props = defineProps<{
  id: number;
  type: keyof typeof windowTypes;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}>();

const emit = defineEmits(["close", "focus"]);

const windowTypes: Record<string, WindowType> = {
  gaming: { title: "🎮 Gaming Library", component: markRaw(GamingWindow) },
  terminal: { title: "🐧 Terminal", component: markRaw(TerminalWindow) }
  // ... other window types
};

if (!windowTypes[props.type]) {
  throw new Error(`Unknown window type: ${props.type}`);
}
const { title, component: contentComponent } = windowTypes[props.type];

function focusWindow(id: number) {
  emit("focus", id);
}

function closeWindow(id: number) {
  emit("close", id);
}

onMounted(() => {
  gsap.from(".window", {
    scale: 0.8,
    opacity: 0,
    duration: 0.3,
    ease: "back.out(1.7)"
  });
});
</script>

<style scoped>
.window {
  border: 1px solid #a0a0a0;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);
}
.title-bar {
  background: linear-gradient(90deg, #4a6fa5, #2c4a76);
  color: white;
  padding: 4px 8px;
  cursor: move;
}
</style>
