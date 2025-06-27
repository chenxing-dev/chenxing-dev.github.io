<template>
    <div class="content-area relative h-full flex flex-col bg-gradient-to-br from-zinc-50 to-zinc-100 overflow-hidden">
        <!-- Gallery Content -->
        <div v-show="currentView === 'gallery'" class="gallery-view flex-1 overflow-auto p-4 md:p-6" ref="galleryView">
            <div class="grid grid-cols-1 grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="(art, index) in artworks" :key="art.id" :data-index="index"
                    class="art-card shadow-md border-2 border-accent cursor-pointer" @click="showArtworkDetail(art)">
                    <div class="art-image-container">
                        <img :src="art.image" :alt="art.title" class="art-image w-full h-48 object-cover" />
                    </div>
                    <div class="px-4 pt-1 pb-2 bg-zinc-50/90">
                        <h3 class="text-lg font-bold text-zinc-800 mb-1">{{ art.title }}</h3>
                        <div class="flex flex-wrap gap-1 mb-1">
                            <span v-for="(tag, tagIndex) in art.tags" :key="tagIndex"
                                class="text-xs px-2 py-0.5 bg-selected border border-accent rounded-lg text-zinc-700">
                                {{ tag }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Artwork View -->
        <div v-if="selectedArtwork" v-show="currentView === 'detail'"
            class="artwork-view absolute inset-0 w-full h-full flex flex-col p-8" @click.self="showGallery"
            ref="artworkView">
            <div class="artwork-content bg-primary">
                <div class="artwork-image-container h-96 lg:h-full overflow-hidden">
                    <img :src="selectedArtwork.image" :alt="selectedArtwork.title"
                        class="artwork-image w-full h-full object-cover" />
                </div>
                <div class="artwork-header px-4 py-2 overflow-auto max-h-96 md:max-h-full">
                    <div class="flex justify-between items-center">
                        <h2 class="artwork-title text-2xl font-bold text-secondary">{{ selectedArtwork.title }}</h2>
                        <button @click="showGallery" class="text-secondary cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { nextTick, ref, type Ref } from 'vue';
import gsap from 'gsap';

interface Artwork {
    id: number;
    title: string;
    image: string;
    description: string;
    tags: string[];
}

// Artwork data
const artworks: Ref<Artwork[]> = ref([
    {
        id: 1,
        title: "Mountain Serenity",
        description: "A tranquil mountain landscape at dawn with mist-covered peaks and a reflective lake. Inspired by the artist's journey through the Himalayas.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000",
        tags: ["Landscape", "Nature", "Mountains"]
    },
    {
        id: 2,
        title: "Urban Dreams",
        description: "An abstract representation of city life with vibrant colors and geometric patterns capturing the energy of urban environments.",
        image: "https://images.unsplash.com/photo-1648032631028-9a5e5f300aaf?q=80&w=1000",
        tags: ["Abstract", "City", "Modern"]
    },
    {
        id: 3,
        title: "Oceanic Harmony",
        description: "A vibrant underwater scene showcasing the diversity of marine life with intricate details of coral reefs and tropical fish.",
        image: "https://images.unsplash.com/photo-1503756234508-e32369269deb?q=80&w=1000",
        tags: ["Ocean", "Nature", "Marine"]
    },
    {
        id: 4,
        title: "Desert Mirage",
        description: "A surreal desert landscape with shifting sand dunes and a distant oasis. Captures the illusion of water in the desert heat.",
        image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1000",
        tags: ["Desert", "Landscape", "Surreal"]
    },
    {
        id: 5,
        title: "Floral Symphony",
        description: "A vibrant explosion of floral patterns and colors, blending realism with abstract elements to create a visual symphony.",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000",
        tags: ["Floral", "Abstract", "Colorful"]
    },
    {
        id: 6,
        title: "Cosmic Journey",
        description: "A cosmic exploration of distant galaxies and nebulae, created with advanced digital techniques to simulate space phenomena.",
        image: "https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=1000",
        tags: ["Space", "Sci-Fi", "Digital"]
    }
]);

const currentView = ref<'gallery' | 'detail'>('gallery');
const selectedArtwork = ref<Artwork | null>(null);

const galleryView = ref<HTMLElement | null>(null);
const artworkView = ref<HTMLElement | null>(null);

const showArtworkDetail = async (artwork: Artwork) => {
    selectedArtwork.value = artwork;

    // Wait for Vue to render the detail view
    await nextTick();

    // Simulate loading delay
    setTimeout(() => {
        // Animate transition to detail view
        gsap.timeline()
            .to(galleryView.value, {
                opacity: 0,
                y: -50,
                duration: 0.5,
                ease: "power2.inOut",
                onComplete: () => {
                    currentView.value = 'detail'; // Render the detail view immediately
                }
            })
            .to(artworkView.value, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
            }, ">");
    }, 100);
};

const showGallery = () => {
    // Animate transition back to gallery
    gsap.timeline()
        .to(artworkView.value, {
            opacity: 0,
            y: 50,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
                currentView.value = 'gallery';
            }
        })
        .to(galleryView.value, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
        }, "-=0.3");
};
</script>

<style scoped></style>