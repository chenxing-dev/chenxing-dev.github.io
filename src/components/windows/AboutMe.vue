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
      <!-- Skills -->
      <div class="bg-white/80 p-4 pb-6 rounded-xl shadow-sm border border-neutral-100">
        <h3 class="text-xl font-bold text-neutral-800 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-secondary" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Technical Skills
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="(skill, index) in skills" :key="index">
            <div class="flex justify-between mb-1">
              <span class="font-medium text-neutral-700 text-nowrap overflow-hidden text-ellipsis">
                {{ skill.name }}</span>
              <span class="text-neutral-500 text-sm">{{ skill.level }}%</span>
            </div>
            <div class="h-2 bg-neutral-200 rounded-full">
              <div class="h-full rounded-full bg-secondary progress" :style="{ width: `${skill.level}%` }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Unprofessional Experience -->
    <div class="mb-4 md:mb-12">
      <h3 class="text-xl md:text-2xl mb-4 md:mb-6 font-bold text-neutral-800 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-secondary" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Unprofessional Experience
      </h3>

      <div class="relative pl-8 border-l-2 border-accent space-y-6 md:space-y-8">
        <div v-for="(item, index) in unprofessionalExperience" :key="index" class="relative">
          <div class="absolute -left-11 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <div class="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <div class="bg-white/90 p-5 rounded-xl shadow-sm border border-neutral-100">
            <span class="text-sm font-medium text-secondary bg-primary px-2 py-1 rounded">
              {{ item.period }}
            </span>
            <h4 class="text-xl font-bold mt-2 mb-1">{{ item.title }}</h4>
            <p class="font-medium text-neutral-700">{{ item.subtitle }}</p>
            <p class="text-neutral-600 my-2 md:my-3 text-sm md:text-base">{{ item.description }}</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="(tech, techIndex) in item.tags" :key="techIndex"
                class="text-xs px-2 py-1 bg-neutral-100 text-neutral-700">
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

// Skills data
const skills = ref([
  { name: "TypeScript", level: 90 },
  { name: "Vue.js", level: 95 },
  { name: "TailwindCSS", level: 92 },
  { name: "React", level: 75 }
]);

// Unprofessional Experience
const unprofessionalExperience = ref([
  {
    period: "2024 - Present",
    title: "Frontend Development",
    subtitle: "Self-Taught Coder",
    description: "Transitioned to modern frontend development. Currently focused on building creative web applications with TypeScript, Vue 3, and TailwindCSS.",
    tags: ["JavaScript", "TypeScript", "Vue.js", "TailwindCSS"]
  },
  {
    period: "2022 - 2023",
    title: "Game Modding Experience",
    subtitle: "Morrowind Mod Developer",
    description: "Created game mods using MWSE-Lua scripting. Built custom gameplay mechanics, UI enhancements, and content expansions for The Elder Scrolls III: Morrowind.",
    tags: ["Lua", "MWSE", "Game Development", "Modding"]
  },
  {
    period: "2022 - 2023",
    title: "Deep Learning Research",
    subtitle: "Thesis Project: Handwritten Math Formula Recognitions",
    description: "Research on a deep learning model using PyTorch to recognize and interpret handwritten mathematical formulas.",
    tags: ["Python", "PyTorch", "CNN", "Deep Learning"]
  },
  {
    period: "2019 - 2022",
    title: "Math Education",
    subtitle: "Programming Courses",
    description: "Completed foundational courses including Programming Fundamentals, Data Structures, and Database Systems.",
    tags: ["Python", "C++", "Algorithms", "Data Structures"]
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

// GSAP animations
onMounted(() => {
  if (contentContainer.value) {
    // Set initial state
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

    // Animate progress bars
    skills.value.forEach((_, i) => {
      const bars = document.querySelectorAll(".progress");
      if (bars[i]) {
        tl.fromTo(bars[i], { width: 0 }, { width: `${skills.value[i].level}%`, duration: 1.5 }, "<0.2");
      }
    });
  }
});
</script>
