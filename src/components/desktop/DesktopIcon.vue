<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core";
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import gsap from "gsap";
import { useSettings } from "@/composables/useSettings";
import { getIconById } from "@/config/apps-registry";

const { settings } = useSettings();
const props = defineProps<{
  label: string;
  id: string;
}>();

const emit = defineEmits<{
  (e: "open", id: string): void;
}>();

const iconComponent = computed(() => {
  const component = getIconById(props.id);
  if (component) {
    return component;
  }
  return null;
});

// Refs for animation targets
const iconContainer = ref<HTMLElement | null>(null);
const iconElement = ref<HTMLElement | null>(null);
const iconLabel = ref<HTMLElement | null>(null);
const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
let hoverTimeline: gsap.core.Timeline | null = null;

// Create hover animation timeline
const createHoverTimeline = () => {
  if (prefersReducedMotion.value) return null;
  if (!iconContainer.value || !iconElement.value || !iconLabel.value) return null;

  return gsap
    .timeline({ paused: true })
    .to(iconContainer.value, {
      scale: 1.15,
      duration: 0.4,
      ease: "back.out(1.7)",
    })
    .to(
      iconElement.value,
      {
        duration: 0.2,
        ease: "sine.inOut",
      },
      "<0.1",
    );
};

// Create vintage boot-up animation
const animateIcons = async () => {
  if (prefersReducedMotion.value || !iconContainer.value) return;

  // Wait for DOM to update
  await nextTick();

  // Hide all icons initially
  gsap.set(iconContainer.value, {
    opacity: 0,
  });

  // Animate icons in sequence
  const tl = gsap.timeline({});

  // Animate icons in sequence
  tl.to(iconContainer.value, {
    opacity: 0,
    duration: gsap.utils.random(0, 2),
    ease: "power2",
  }).to(iconContainer.value, {
    opacity: 1,
    duration: gsap.utils.random(0, 0.4),
    ease: "power2",
  });
};

const handleMouseEnter = () => {
  if (prefersReducedMotion.value) return;

  hoverTimeline ??= createHoverTimeline();
  hoverTimeline?.play();
};

const handleMouseLeave = () => {
  if (!hoverTimeline) return;

  hoverTimeline.reverse();
  hoverTimeline.eventCallback("onReverseComplete", () => {
    hoverTimeline?.kill();
    hoverTimeline = null;
  });
};

const openApp = () => {
  emit("open", props.id);
};

// Setup animations when component mounts
onMounted(() => {
  animateIcons();
});

// Clean up animations
onUnmounted(() => {
  if (hoverTimeline) hoverTimeline.kill();
});
</script>
<template>
  <button
    ref="iconContainer"
    type="button"
    class="desktop-icon group flex flex-col items-center p-2 w-16 cursor-pointer border-0 bg-transparent text-inherit focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2"
    :aria-label="`Open ${label}`"
    :title="`Open ${label}`"
    @click="openApp"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div
      ref="iconElement"
      class="icon-container mb-1 w-12 h-12 flex items-center justify-center rounded-lg"
    >
      <component
        :is="iconComponent"
        v-if="iconComponent"
        class="text-6xl bg-transparent"
        aria-hidden="true"
      />
    </div>
    <span
      ref="iconLabel"
      class="text-sm text-zinc-500 px-1 py-0.5 rounded text-center text-shadow-lg text-secondary"
      :class="settings.background + ' ' + settings.theme"
    >
      {{ label }}
    </span>
  </button>
</template>
