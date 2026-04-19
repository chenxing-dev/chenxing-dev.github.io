<script setup lang="ts">
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
let hoverTimeline: gsap.core.Timeline | null = null;

// Create hover animation timeline
const createHoverTimeline = () => {
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

// Setup event listeners
const setupEventListeners = () => {
  if (!iconContainer.value) return;
  // Named handlers so we can remove them later
  const onMouseEnter = () => {
    hoverTimeline = createHoverTimeline();

    if (hoverTimeline) {
      hoverTimeline.play();
    }
  };

  const onMouseLeave = () => {
    if (hoverTimeline) {
      hoverTimeline.reverse();

      hoverTimeline.eventCallback("onReverseComplete", () => {
        hoverTimeline?.kill();
        hoverTimeline = null;
      });
    }
  };

  iconContainer.value.addEventListener("mouseenter", onMouseEnter);
  iconContainer.value.addEventListener("mouseleave", onMouseLeave);

  // Expose handlers for removal in onUnmounted by attaching to the element
  // (avoid creating reactive refs for these simple functions)
  (iconContainer.value as any).__desktopOnMouseEnter = onMouseEnter;
  (iconContainer.value as any).__desktopOnMouseLeave = onMouseLeave;
};

const openApp = () => {
  emit("open", props.id);
};

// Setup animations when component mounts
onMounted(() => {
  animateIcons();
  setupEventListeners();
});

// Clean up animations
onUnmounted(() => {
  if (hoverTimeline) hoverTimeline.kill();

  if (iconContainer.value) {
    // Retrieve the same handler references we attached when setting up listeners
    const onMouseEnter = (iconContainer.value as any).__desktopOnMouseEnter as
      | EventListener
      | undefined;
    const onMouseLeave = (iconContainer.value as any).__desktopOnMouseLeave as
      | EventListener
      | undefined;

    if (onMouseEnter) iconContainer.value.removeEventListener("mouseenter", onMouseEnter);
    if (onMouseLeave) iconContainer.value.removeEventListener("mouseleave", onMouseLeave);

    // Clean up attached properties
    delete (iconContainer.value as any).__desktopOnMouseEnter;
    delete (iconContainer.value as any).__desktopOnMouseLeave;
  }
});
</script>
<template>
  <div
    ref="iconContainer"
    class="desktop-icon group flex flex-col items-center p-2 w-16 cursor-pointer"
    @click="openApp"
  >
    <div
      ref="iconElement"
      class="icon-container mb-1 w-12 h-12 flex items-center justify-center rounded-lg"
    >
      <component :is="iconComponent" v-if="iconComponent" class="text-6xl bg-transparent" />
    </div>
    <span
      ref="iconLabel"
      class="text-sm text-zinc-500 px-1 py-0.5 rounded text-center text-shadow-lg text-secondary"
      :class="settings.background + settings.theme"
    >
      {{ label }}
    </span>
  </div>
</template>
