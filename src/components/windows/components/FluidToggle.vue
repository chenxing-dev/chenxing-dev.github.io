<script setup lang="ts">
import { ref, onMounted } from "vue";

const isActive = ref(false);
const togglePosition = ref({ x: 0, y: 0 });
const rippleElements = ref<HTMLDivElement[]>([]);

const toggleState = (e: MouseEvent) => {
  isActive.value = !isActive.value;
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  togglePosition.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
  createRipple();
};

const createRipple = () => {
  if (rippleElements.value.length > 4) {
    const oldest = rippleElements.value.shift();
    oldest?.remove();
  }

  const ripple = document.createElement("div");
  ripple.className = "absolute rounded-full bg-[#6a8b9c] transform -translate-x-1/2 -translate-y-1/2";
  ripple.style.left = `${togglePosition.value.x}px`;
  ripple.style.top = `${togglePosition.value.y}px`;
  ripple.style.width = "0";
  ripple.style.height = "0";
  ripple.style.opacity = "0.7";

  document.getElementById("toggle-container")?.appendChild(ripple);
  rippleElements.value.push(ripple);

  setTimeout(() => {
    ripple.style.transition = "all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)";
    ripple.style.width = "200px";
    ripple.style.height = "200px";
    ripple.style.opacity = "0";
  }, 10);

  setTimeout(() => {
    ripple.remove();
    rippleElements.value = rippleElements.value.filter(r => r !== ripple);
  }, 600);
};

onMounted(() => {
  // Initialize with one ripple for effect
  setTimeout(() => {
    togglePosition.value = { x: 30, y: 30 };
    createRipple();
  }, 300);
});
</script>

<template>
  <div class="flex flex-col items-center">
    <div id="toggle-container" class="relative w-32 h-16 overflow-hidden cursor-pointer rounded-full" @click="toggleState">
      <!-- Toggle Track -->
      <div class="absolute inset-0 rounded-full transition-colors duration-500 overflow-hidden" :class="isActive ? 'bg-zinc-600' : 'bg-zinc-300'"></div>

      <!-- Toggle Handle -->
      <div
        class="absolute top-2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-500"
        :style="{
          left: isActive ? 'calc(100% - 3.5rem)' : '0.5rem'
        }"
      >
        <div class="w-8 h-8 rounded-full transition-all duration-500" :class="isActive ? 'bg-zinc-600' : 'bg-zinc-300'"></div>
      </div>

      <!-- Labels -->
      <div class="absolute top-1/2 right-4 transform -translate-y-1/2 text-white font-bold transition-opacity duration-300" :class="isActive ? 'opacity-0' : 'opacity-100'">OFF</div>
      <div class="absolute top-1/2 left-4 transform -translate-y-1/2 text-white font-bold transition-opacity duration-300" :class="isActive ? 'opacity-100' : 'opacity-0'">ON</div>
    </div>

    <div class="mt-8 text-center">
      <h3 class="text-xl font-bold text-[#6a8b9c] mb-2">Fluid Motion Toggle</h3>
      <p class="text-gray-600 max-w-md">Experience the fluid dynamics of this interactive toggle. Click anywhere to activate with a ripple effect that propagates through the interface.</p>
    </div>
  </div>
</template>
