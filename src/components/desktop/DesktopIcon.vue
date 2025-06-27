<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useSettings } from "../useSettings";
import { getIconByType } from "../../config/app";
import gsap from "gsap";
import { CSSPlugin } from "gsap/CSSPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

// Register CSSPlugin to enable rotation and other CSS properties
gsap.registerPlugin(CSSPlugin, MotionPathPlugin);

const { settings } = useSettings();
const props = defineProps<{
  label: string;
  type: string;
}>();

const emit = defineEmits<{
  (e: "open", type: string): void;
}>();

const iconComponent = computed(() => {
  const component = getIconByType(props.type);
  if (component) {
    return component;
  }
  return null;
});

// Refs for animation targets
const iconContainer = ref<HTMLElement | null>(null);
const iconElement = ref<HTMLElement | null>(null);
const iconLabel = ref<HTMLElement | null>(null);
let hoverAnimation: gsap.core.Timeline | null = null;

// GSAP animations
const setupAnimations = () => {
  if (!iconContainer.value || !iconElement.value || !iconLabel.value) return;

  // Clean up any existing animations
  if (hoverAnimation) hoverAnimation.kill();

  // Hover animation timeline
  hoverAnimation = gsap
    .timeline({ paused: true })
    .to(iconContainer.value, {
      scale: 1.2,
      duration: 0.3,
      ease: "back.out(1.7)",
      yoyo: true,
      repeat: 1
    })
    .to(
      iconElement.value,
      {
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut"
      },
      "<"
    )
    .to(
      iconLabel.value,
      {
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        duration: 0.2
      },
      "<"
    );

  // Event listeners
  iconContainer.value.addEventListener("mouseenter", () => {
    hoverAnimation?.play();
  });

  iconContainer.value.addEventListener("mouseleave", () => {});
};

const openApp = () => {
  if (!iconContainer.value || !iconElement.value) return;

  // Create a bounce animation when opening
  const tl = gsap.timeline();

  tl.to(iconContainer.value, {
    scale: 1.5,
    duration: 0.1,
    ease: "power2.out"
  })
    .to(iconContainer.value, {
      scale: 0.8,
      duration: 0.2,
      ease: "bounce.out"
    })
    .to(iconContainer.value, {
      scale: 1,
      duration: 0.2,
      ease: "elastic.out(1, 0.5)",
      onComplete: () => {
        emit("open", props.type);
      }
    });

  // Add icon wobble effect
  if (iconElement.value) {
    gsap.to(iconElement.value, {
      duration: 0.8,
      ease: "back.out(1.7)"
    });
  }
};

// Setup animations when component mounts
onMounted(() => {
  // Wait for next tick to ensure elements are rendered
  setTimeout(setupAnimations, 100);
});

// Clean up animations
onUnmounted(() => {
  if (hoverAnimation) hoverAnimation.kill();

  if (iconContainer.value) {
    iconContainer.value.removeEventListener("mouseenter", () => {});
    iconContainer.value.removeEventListener("mouseleave", () => {});
  }
});
</script>
<template>
  <div class="desktop-icon group flex flex-col items-center p-2 w-16 cursor-pointer" @dblclick="openApp">
    <div ref="iconContainer" class="icon-container mb-1 w-12 h-12 flex items-center justify-center rounded-lg">
      <component :is="iconComponent" v-if="iconComponent" ref="iconElement" class="text-6xl bg-transparent" />
    </div>
    <span ref="iconLabel" class="text-sm text-zinc-500 px-1 py-0.5 rounded text-center text-shadow-lg text-secondary" :class="settings.background + settings.theme">
      {{ label }}
    </span>
  </div>
</template>
