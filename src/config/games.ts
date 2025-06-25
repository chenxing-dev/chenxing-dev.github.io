import { ref } from "vue";

export interface Game {
  id: string;
  title: string;
  description: string;
  icon?: string;
  genre: string;
  longDescription: string;
  thumbnail: string;
  tech: string[];
  features: string[];
  playUrl: string;
  width: number;
  height: number;
}

export const games = ref<Game[]>([
  {
    genre: "platformer",
    id: "jumping-dino",
    icon: "🦖",
    title: "Jumping Dino",
    description: "Endless runner where you control a jumping dinosaur.",
    longDescription: "Jumping Dino is an endless runner game where you control a cute pixel art dinosaur. Jump over obstacles, collect coins, and unlock new characters as you try to achieve the highest score possible. Features simple one-touch controls and charming retro graphics.",
    thumbnail: "/images/jumping-dino.png",
    tech: ["Kaplay", "JavaScript", "HTML5"],
    features: ["Endless gameplay with increasing difficulty", "Unlockable characters and skins"],
    playUrl: "https://chenxing-dev.github.io/jumping-dino/",
    width: 720,
    height: 540
  },
  // Sample game data
  {
    genre: "RPG",
    description: "Pokémon-inspired adventure with D&D mechanics in a post-apocalyptic world.",
    longDescription: "In a post-apocalyptic world where no humans remain, 3 Pokémons work together to escape an abandoned power plant. This game combines Pokémon with Dungeons & Dragons mechanics, allowing players to explore, battle, and solve puzzles in a unique setting. Strategize with Pokémon abilities, manage resources, and take on challenging encounters as our heroes seek freedom.",
    title: "Pokémon: Power Plant Escape",
    id: "pokemon-power-plant-escape",
    icon: "⚡",
    thumbnail: "/images/pokemon-power-plant-escape.png",
    tech: ["Python", "Pygame", "Pixel Art"],
    features: ["Turn-based combat system", "Puzzle-solving mechanics", "Post-apocalyptic setting"],
    playUrl: "#",
    width: 800,
    height: 600
  },
  {
    icon: "🧩",
    genre: "Puzzle",
    description: "Relaxing block puzzle game with colorful shapes.",
    id: "color-blocks",
    title: "Color Blocks",
    longDescription: "Like Tetris but with a twist, Color Blocks is a relaxing puzzle game where you fit colorful shapes into a grid. The game features soothing music and a zen mode for stress relief. Perfect for players of all ages who enjoy casual puzzle games.",
    thumbnail: "/images/color-blocks.png",
    tech: ["Phaser", "JavaScript", "HTML5"],
    features: ["Relaxing gameplay", "Colorful graphics", "No time limit"],
    playUrl: "#",
    width: 480,
    height: 480
  },
  {
    icon: "🐾",
    id: "cozy-pet-simulator",
    title: "Cozy Pet Simulator",
    thumbnail: "/images/cozy-pet-simulator.png",
    genre: "Simulation",
    description: "Wholesome pet simulator with pixel art animals and cozy gameplay.",
    longDescription: "Cozy Pet Simulator is a cozy pet simulation game where you care for adorable pixel art animals. Build your dream pet sanctuary, nurture your companions, and participate in fun minigames. Features a day/night cycle, dynamic weather, and each pet has its own personality and needs.",
    tech: ["Unity", "C#"],
    features: ["Relaxing gameplay", "Cute pixel art style", "Minigames and activities"],
    playUrl: "#",
    width: 480,
    height: 480
  }
]);
