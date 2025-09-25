<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import gsap from "gsap";
import { useSettings } from "@/composables/useSettings";
import { getIconById } from "@/config/apps-registry";


const { settings } = useSettings();
const props = defineProps<{
  label: string;
  type: string;
}>();

const emit = defineEmits<{
  (e: "open", type: string): void;
}>();

const iconComponent = computed(() => {
  const component = getIconById(props.type);
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

  return gsap.timeline({ paused: true })
    .to(iconContainer.value, {
      scale: 1.15,
      duration: 0.4,
      ease: "back.out(1.7)"
    })
    .to(iconElement.value, {
      duration: 0.2,
      ease: "sine.inOut"
    }, "<0.1");
};


// Create vintage boot-up animation
const animateIcons = async () => {
  // Wait for DOM to update
  await nextTick();

  // Hide all icons initially
  gsap.set(iconContainer.value, {
    opacity: 0
  });

  // Animate icons in sequence
  const tl = gsap.timeline({});

  // Animate icons in sequence
  tl.to(iconContainer.value, {
    opacity: 0,
    duration: gsap.utils.random(0, 2),
    ease: "power2"
  }).to(iconContainer.value, {
    opacity: 1,
    duration: gsap.utils.random(0, 0.4),
    ease: "power2"
  });
}

// Setup event listeners
const setupEventListeners = () => {
  if (!iconContainer.value) return;

  iconContainer.value.addEventListener('mouseenter', () => {
    // Create a new timeline for each hover
    hoverTimeline = createHoverTimeline();

    if (hoverTimeline) {
      hoverTimeline.play();
    }
  });

  iconContainer.value.addEventListener('mouseleave', () => {
    if (hoverTimeline) {
      // Reverse to initial state
      hoverTimeline.reverse();

      // Destroy timeline after reverse completes
      hoverTimeline.eventCallback("onReverseComplete", () => {
        hoverTimeline?.kill();
        hoverTimeline = null;
      });
    }
  })
};

const openApp = () => {
  emit("open", props.type);
};

// Setup animations when component mounts
onMounted(() => {
  animateIcons()
  setupEventListeners();
});

// Clean up animations
onUnmounted(() => {
  if (hoverTimeline) hoverTimeline.kill();

  if (iconContainer.value) {
    iconContainer.value.removeEventListener('mouseenter', () => { });
    iconContainer.value.removeEventListener('mouseleave', () => { });
  }
});
</script>
<template>
  <div ref="iconContainer" class="desktop-icon group flex flex-col items-center p-2 w-16 cursor-pointer"
    @click="openApp">
    <div ref="iconElement" class="icon-container mb-1 w-12 h-12 flex items-center justify-center rounded-lg">
      <component :is="iconComponent" v-if="iconComponent" class="text-6xl bg-transparent" />
    </div>
    <span ref="iconLabel" class="text-sm text-zinc-500 px-1 py-0.5 rounded text-center text-shadow-lg text-secondary"
      :class="settings.background + settings.theme">
      {{ label }}
    </span>
  </div>
</template>
