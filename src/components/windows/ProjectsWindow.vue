<template>
  <div class="h-full flex flex-col bg-zinc-100">
    <!-- Main Content -->
    <div class="projects-window h-full p-4 md:p-6 flex-1 overflow-y-auto">
      <div class="projects-grid grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="(project, index) in projects" :key="index" class="project-card" :data-index="index" ref="projectCardRefs">
          <div class="project-card-inner bg-zinc-50 rounded-xl border border-zinc-200 shadow-sm overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
            <div class="p-5 flex-1">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-lg font-semibold text-zinc-800">{{ project.name }}</h3>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-xs text-zinc-500 flex items-center gap-1">
                      {{ project.language }}
                    </span>
                  </div>
                </div>
                <!-- Link Container -->
                <div class="flex gap-1 -mr-1">
                  <a v-if="project.url" :href="project.url" target="_blank" class="text-zinc-500 hover:text-zinc-700 transition-colors p-1 -mr-1" title="GitHub Repository">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                  <!-- Demo Link -->
                  <a v-if="project.demoUrl" :href="project.demoUrl" target="_blank" class="text-zinc-500 hover:text-zinc-700 transition-colors p-1" title="Live Demo">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                    </svg>
                  </a>
                </div>
              </div>

              <p class="text-zinc-600 text-sm mb-4">{{ project.description }}</p>

              <div class="flex flex-wrap gap-2 mb-4">
                <span v-for="topic in project.topics.slice(0, 4)" :key="topic" class="text-xs px-2 py-1 rounded-full bg-zinc-100 text-zinc-700">
                  {{ topic }}
                </span>
                <span v-if="project.topics.length > 4" class="text-xs px-2 py-1 rounded-full bg-zinc-100 text-zinc-700"> +{{ project.topics.length - 4 }} more </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Bar -->
    <div class="flex items-center justify-between px-3 py-1 text-xs text-zinc-500 bg-zinc-50/90 border-t border-zinc-300">
      <div>Showing {{ projects.length }} projects</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import gsap from "gsap";

const projects = ref([
  {
    description: "Discover which Linux distribution is right for you with this interactive quiz. Answer a series of questions to find your ideal distro match.",
    name: "Linux Distro Quiz",
    topics: ["linux", "quiz", "web-app", "react", "typescript"],
    url: "https://github.com/chenxing-dev/linux-distro-quiz",
    demoUrl: "https://chenxing-dev.github.io/linux-distro-quiz/",
    language: "TypeScript"
  },
  {
    description: "A personal blog built with Astro and TypeScript, featuring articles on Arch Linux, web development, and more.",
    name: "陈刑's Blog",
    topics: ["blog", "astro", "typescript", "tailwindcss", "web-development"],
    url: "https://github.com/chenxing-dev/blog",
    demoUrl: "https://chenxing-dev.github.io/blog/",
    language: "TypeScript"
  },
  {
    name: "陈刑OS",
    description: "A cozy minimalist OS-styled personal website built with Vue.js and TypeScript featuring a clean design, smooth animations, and a focus on simplicity.",
    url: "https://github.com/chenxing-dev/chenxing-os",
    language: "TypeScript",
    topics: ["vue", "typescript", "tailwindcss", "personal-website"]
  },
  {
    description: "A minimalist to-do list app built with Alpine.js. Features include creating, editing, and deleting tasks, as well as filtering by status.",
    language: "JavaScript",
    name: "Todo List",
    url: "https://github.com/chenxing-dev/todo-list",
    demoUrl: "https://chenxing-dev.github.io/todo-list",
    topics: ["todo", "alpinejs", "productivity", "web-app"]
  },
  {
    language: "Bash",
    description: "a dotfiles repository for my Arch Linux setup, featuring a customized Qtile window manager, archinstall configuration, an automated setup script, and more.",
    name: "Arch Linux Dotfiles",
    topics: ["archlinux", "dotfiles", "qtile", "bash", "linux"],
    url: "https://github.com/chenxing-dev/dotfiles"
  }
]);

// Initialize animations
const projectCardRefs = ref<HTMLElement[]>([]);

onMounted(async () => {
  await nextTick();
  projectCardRefs.value.forEach((card, index) => {
    // Set initial state
    gsap.set(card, {
      opacity: 0,
      y: 30
    });

    // Create animation timeline
    const tl = gsap.timeline({});

    // Animate card entry
    tl.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "back.out(1.4)",
      delay: index * 0.1
    });

    // Add subtle stagger effect to inner elements
    tl.fromTo(
      card.querySelectorAll("h3, p, span"),
      {
        opacity: 0,
        y: 10
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.3
      },
      "<0.2"
    );
  });
});
</script>

<style scoped>
.projects-window {
  scrollbar-color: #71717a #e4e4e7;
  scrollbar-width: thin;
}

.project-card-inner {
  transform-style: preserve-3d;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  transform: translateZ(0);
}

.project-card:hover .project-card-inner {
  transform: translateY(-5px) translateZ(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}
</style>
