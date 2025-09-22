<template>
  <!-- Content Container -->
  <div ref="contentContainer" class="flex-1 overflow-y-auto p-6 md:p-8">
    <!-- Hero Section -->
    <div class="flex flex-col md:flex-row gap-8 items-center md:mb-4">
      <div class="flex-1 text-center md:text-left">
        <h1 class="text-4xl md:text-5xl font-bold text-neutral-800 mb-2"><span class="text-secondary">Hi, I'm </span>
          <span class="font-serif">陈刑</span> <a class="text-2xl md:text-3xl text-neutral-500 underline"
            href="https://github.com/chenxing-dev">(chenxing-dev),</a>
        </h1>
        <h2 class="text-xl md:text-2xl font-medium text-neutral-600 mb-4">a Frontend Developer.</h2>
      </div>
    </div>

    <!-- Info Grid -->
    <div class="grid grid-cols-1 gap-8 mb-4 md:mb-8">
      <!-- Skills / Tech Stack -->
      <div class="bg-white/80 p-4 pb-6 rounded-xl shadow-sm border border-neutral-100">
        <h3 class="text-xl font-bold text-neutral-800 mb-4 flex items-center">
          🛠️ Tech Stack
        </h3>
        <div>
          <div class="mb-2 font-semibold text-neutral-700">Frontend:</div>
          <div class="flex flex-wrap gap-2">
            <span v-for="(tech, _) in frontendStack" :key="tech"
              class="px-3 py-1 rounded-full font-medium text-sm text-white cursor-pointer" :style="{
                backgroundColor: badgeColors[tech]?.bg || '#888',
                color: badgeColors[tech]?.text || '#fff'
              }">
              {{ tech }}
            </span>
          </div>
          <div class="mt-4 mb-2 font-semibold text-neutral-700">Tools & Platforms:</div>
          <div class="flex flex-wrap gap-2">
            <span v-for="(tool, _) in toolsStack" :key="tool"
              class="px-3 py-1 rounded-full font-medium text-sm text-white shadow cursor-pointer" :style="{
                backgroundColor: badgeColors[tool]?.bg || '#888',
                color: badgeColors[tool]?.text || '#fff'
              }">
              {{ tool }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-4 md:mb-12">
      <h3 class="text-xl md:text-2xl mb-4 md:mb-6 font-bold text-neutral-800 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-secondary" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Learning Journey
      </h3>

      <div class="relative pl-8 border-l-2 border-neutral-400/50 space-y-6 md:space-y-8">
        <div v-for="(item, index) in unprofessionalExperience" :key="index" class="relative group">
          <!-- Timeline Dot with Icon -->
          <div
            class="absolute rounded-full bg-linear-to-br from-neutral-50 to-neutral-100 flex items-center justify-center border-1 border-accent text-white shadow-md px-1 pb-1 -left-13 top-4 w-8 h-8 md:w-10 md:h-10">
            <span v-if="item.icon" class="text-xl">{{ item.icon }}</span>
            <span v-else class="w-4 h-4 bg-white rounded-full"></span>
          </div>
          <div
            class="bg-white/90 p-5 rounded-xl shadow-sm border border-neutral-100 transition-all group-hover:shadow-md">
            <span class="text-xs font-semibold text-secondary bg-primary/10 py-1 rounded tracking-wide">
              {{ item.period }}
            </span>
            <h4 class="text-xl font-bold mt-2 mb-1">{{ item.title }}</h4>
            <p class="font-medium text-neutral-700">{{ item.subtitle }}</p>
            <p class="text-neutral-600 my-2 md:my-3 text-sm md:text-base">{{ item.description }}</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="(tech, techIndex) in item.tags" :key="techIndex"
                class="text-xs px-2 pb-1 bg-neutral-100 text-neutral-700 rounded-lg shadow-sm cursor-pointer hover:bg-neutral-200 transition"
                :style="{
                  backgroundColor: badgeColors[tech]?.bg || '#eee',
                  color: badgeColors[tech]?.text || '#333'
                }">
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact -->
    <div class="bg-white/90 rounded-xl shadow-sm border border-neutral-100 px-6 py-4">
      <h3 class="text-xl md:text-2xl font-bold text-neutral-800 mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-secondary" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        Contact With Me
      </h3>
      <div class="grid grid-rows-2 md:grid-rows-1 md:grid-cols-2 gap-2 md:gap-4">
        <a v-for="(contact, index) in contacts" :key="index" :href="contact.link" target="_blank"
          class="flex items-center px-4 py-2 md:p-4 bg-neutral-50 rounded-lg hover:bg-neutral-50 transition-colors group border border-neutral-200 hover:border-neutral-300">
          <div class="w-6 h-6 md:w-12 md:h-12 rounded-full flex flex-shrink-0 items-center justify-center mr-2">
            <component :is="contact.icon" class="w-6 h-6 text-neutral-600 group-hover:text-neutral-700" />
          </div>
          <div>
            <div class="text-sm text-neutral-500">{{ contact.label }}</div>
            <div class="text-sm md:text-base font-medium text-neutral-800 group-hover:text-neutral-700">
              {{ contact.value }}</div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineAsyncComponent, markRaw } from "vue";
import { gsap } from "gsap";

const contentContainer = ref<HTMLElement | null>(null);

const frontendStack = [
  "JavaScript", "TypeScript", "React", "Vue", "Svelte", "Astro", "Preact", "Alpine.js", "TailwindCSS"
];
const toolsStack = [
  "Python", "Node.js", "Arduino", "Arch Linux", "C++", "Lua"
];
const badgeColors: Record<string, { bg: string; text: string }> = {
  "JavaScript": { bg: "#F7DF1E", text: "#222" },
  "TypeScript": { bg: "#3178C6", text: "#fff" },
  "React": { bg: "#61DAFB", text: "#222" },
  "Vue": { bg: "#42B883", text: "#fff" },
  "Vue.js": { bg: "#42B883", text: "#fff" },
  "Svelte": { bg: "#FF3E00", text: "#fff" },
  "Astro": { bg: "#FF5D01", text: "#fff" },
  "Preact": { bg: "#673AB8", text: "#fff" },
  "Alpine.js": { bg: "#8BC0D0", text: "#fff" },
  "Python": { bg: "#3776AB", text: "#fff" },
  "Node.js": { bg: "#339933", text: "#fff" },
  "Arduino": { bg: "#00878F", text: "#fff" },
  "Arch Linux": { bg: "#1793D1", text: "#fff" },
  "TailwindCSS": { bg: "#38B2AC", text: "#fff" },
  "Lua": { bg: "#000080", text: "#fff" },
  "PyTorch": { bg: "#EE4C2C", text: "#fff" },
  "C++": { bg: "#00599C", text: "#fff" },
};

// Unprofessional Experience
const unprofessionalExperience = ref([
  {
    period: "2024 - Present",
    title: "Frontend Development",
    subtitle: "Self-Taught Coder",
    description: "Building creative web apps with TypeScript, Vue 3, and TailwindCSS. ",
    tags: ["JavaScript", "TypeScript", "Vue.js", "TailwindCSS"],
    icon: "💻"
  },
  {
    period: "2022 - 2023",
    title: "Game Modding Experience",
    subtitle: "Morrowind Mod Developer",
    description: "Crafted mods with MWSE-Lua scripting. Designed new and immersive gameplay mechanics for The Elder Scrolls III: Morrowind.",
    tags: ["Lua", "MWSE", "Game Development", "Modding"],
    icon: "🎮"
  },
  {
    period: "2022 - 2023",
    title: "Deep Learning Research",
    subtitle: "Thesis Project: Handwritten Math Formula Recognitions",
    description: "Research on a deep learning model using PyTorch to interpret handwritten math formulas. Learned a ton about neural networks and data science.",
    tags: ["Python", "PyTorch", "CNN", "Deep Learning"],
    icon: "🧠"
  },
  {
    period: "2019 - 2022",
    title: "Math Education",
    subtitle: "Programming Courses",
    description: "Completed courses in Programming Fundamentals, Data Structures, and Database Systems.",
    tags: ["Python", "C++", "Algorithms", "Data Structures"],
    icon: "📚"
  }
]);

// Contact information
const contacts = markRaw([
  {
    label: "GitHub",
    value: "@chenxing-dev",
    link: "https://github.com/chenxing-dev",
    icon: defineAsyncComponent(() => import("../../icons/GithubIcon.vue"))
  },
  {
    label: "微博",
    value: "@陈刑很刑",
    link: "https://weibo.com/u/7874224893",
    icon: defineAsyncComponent(() => import("../../icons/WeiboIcon.vue"))
  }
]);

const animateContent = () => {
  if (!contentContainer.value) return;

  console.log("Animating content");
  // Set initial state for main sections
  gsap.set(contentContainer.value.children, { opacity: 0, y: 20 });

  // Create timeline
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.to(
    contentContainer.value.children,
    {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      duration: 0.5
    },
    0.2
  );
}

// GSAP animations
onMounted(() => {
  // Animate main container
  animateContent();
});
</script>
