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
                <a :href="project.url" target="_blank" class="text-zinc-500 hover:text-zinc-700 transition-colors p-1 -mt-1 -mr-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                  </svg>
                </a>
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
    topics: ["todo", "alpinejs", "productivity", "web-app"]
  },
  {
    description: "A personal blog built with Astro and TypeScript, featuring articles on Arch Linux, web development, and more.",
    name: "陈刑's Blog",
    topics: ["blog", "astro", "typescript", "tailwindcss", "web-development"],
    url: "https://github.com/chenxing-dev/blog",
    language: "TypeScript"
  },
  {
    language: "TypeScript",
    description: "Calculator app with scientific functions, history, and unit conversion built with React and TypeScript. Features include a clean UI, keyboard shortcuts, and responsive design.",
    name: "Smart Calculator",
    url: "https://github.com/chenxing-dev/smart-calculator",
    topics: ["calculator", "typescript", "web-app", "utilities"]
  },
  {
    language: "Bash",
    description: "a dotfiles repository for my Arch Linux setup, featuring a customized Qtile window manager, archinstall configuration, an automated setup script, and more.",
    name: "Arch Linux Dotfiles",
    topics: ["archlinux", "dotfiles", "qtile", "bash", "linux"],
    url: "https://github.com/chenxing-dev/dotfiles"
  },
  {
    description: "Discover which Linux distribution is right for you with this interactive quiz. Answer a series of questions to find your ideal distro match.",
    name: "Linux Distro Quiz",
    topics: ["linux", "quiz", "web-app", "react", "typescript"],
    url: "https://github.com/chenxing-dev/linux-distro-quiz",
    language: "TypeScript"
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
