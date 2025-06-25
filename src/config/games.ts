import { ref } from "vue";

export interface Game {
  id: string;
  title: string;
  description: string;
  category: string;
  icon?: string;
  year: number;
  genre: string;
  longDescription: string;
  thumbnail: string;
  tech: string[];
  features: string[];
  playUrl: string;
  width?: number; // Optional width for embedded games
  height?: number; // Optional height for embedded games
}

// Sample game data
export const games = ref<Game[]>([
  {
    id: "pixel-quest",
    icon: "🕹️",
    title: "Pixel Quest",
    year: 2025,
    genre: "Platformer",
    description: "Retro platformer with modern mechanics and charming pixel art.",
    longDescription: "Pixel Quest is a love letter to classic platformers, featuring tight controls, challenging levels, and a vibrant pixel art world. Explore diverse biomes, defeat quirky enemies, and uncover hidden secrets across 50+ levels. Built with Godot Engine and a custom pixel art workflow.",
    thumbnail: "/images/pixel-quest.png",
    tech: ["Godot", "GDScript", "Pixel Art"],
    features: ["50+ hand-crafted levels", "6 unique biomes to explore", "Custom physics engine", "Original chiptune soundtrack", "Speedrun mode with leaderboards"],
    category: "platformer",
    playUrl: "#"
  },
  {
    id: "quantum-puzzle",
    title: "Quantum Puzzle",
    icon: "🧩",
    year: 2025,
    genre: "Puzzle",
    description: "Mind-bending puzzle game with quantum mechanics concepts.",
    longDescription: "Quantum Puzzle challenges players to solve spatial puzzles using quantum superposition principles. Manipulate objects in multiple states simultaneously across parallel dimensions. Features a unique visual style and progressively complex mechanics that teach real quantum concepts through gameplay.",
    thumbnail: "/images/quantum-puzzle.png",
    tech: ["Unity", "C#", "Shader Graph"],
    features: ["80+ challenging puzzles", "Quantum mechanics-based gameplay", "Minimalist aesthetic design", "Procedural puzzle generation", "Educational content integrated"],
    category: "puzzle",
    playUrl: "https://www.lexaloffle.com/bbs/widget.php?pid=picoku",
    width: 400,
    height: 400
  },
  {
    id: "neon-drift",
    icon: "🏎️",
    title: "Neon Drift",
    year: 2025,
    genre: "Racing",
    description: "Futuristic racing game with neon visuals and synthwave soundtrack.",
    longDescription: "Neon Drift combines high-speed racing with rhythm game elements. Drift through neon-lit cityscapes to the beat of an original synthwave soundtrack. Features a track editor, multiplayer races, and a dynamic difficulty system that adapts to your skill level.",
    thumbnail: "/images/neon-drift.png",
    tech: ["Unreal", "C++", "Blueprint"],
    features: ["12 unique racing tracks", "Dynamic soundtrack integration", "Track editor with sharing", "Online multiplayer races", "Customizable vehicles"],
    category: "arcade",
    playUrl: "#"
  },
  {
    id: "realm-of-echoes",
    icon: "🌌",
    title: "Realm of Echoes",
    year: 2025,
    genre: "RPG",
    description: "Story-driven RPG with branching narratives and tactical combat.",
    longDescription: "Realm of Echoes is an isometric RPG featuring deep character customization, meaningful choices, and tactical turn-based combat. Explore a handcrafted world full of rich lore, complex characters, and challenging moral dilemmas. Every decision shapes your journey through this narrative-rich adventure.",
    thumbnail: "/images/realm-of-echoes.png",
    tech: ["RPG Maker", "JavaScript", "Pixel Art"],
    features: ["40+ hours of gameplay", "Branching narrative with 8 endings", "Tactical turn-based combat", "Deep character progression", "Original orchestral soundtrack"],
    category: "rpg",
    playUrl: "#"
  },
  {
    id: "tower-tactics",
    icon: "🛡️",
    title: "Tower Tactics",
    year: 2025,
    genre: "Strategy",
    description: "Tower defense with deep strategy and base-building elements.",
    longDescription: "Tower Tactics reinvents the tower defense genre with base-building mechanics and resource management. Design your defenses, manage resources, and deploy special abilities to fend off increasingly challenging waves of enemies. Features procedurally generated maps and daily challenges.",
    thumbnail: "/images/tower-tactics.png",
    tech: ["Phaser", "TypeScript", "WebGL"],
    features: ["Procedurally generated maps", "30+ unique tower types", "Resource management system", "Daily challenge modes", "Endless survival mode"],
    category: "strategy",
    playUrl: "#"
  },
  {
    id: "pixel-paws",
    icon: "🐾",
    title: "Pixel Paws",
    year: 2025,
    genre: "Simulation",
    description: "Wholesome pet simulator with pixel art animals and cozy gameplay.",
    longDescription: "Pixel Paws is a cozy pet simulation game where you care for adorable pixel art animals. Build your dream pet sanctuary, nurture your companions, and participate in fun minigames. Features a day/night cycle, changing seasons, and a heartwarming story about friendship.",
    thumbnail: "/images/pixel-paws.png",
    tech: ["Unity", "C#", "Aseprite"],
    features: ["15+ unique pets to care for", "Customizable sanctuary", "Day/night and seasonal cycles", "Heartwarming storyline", "Relaxing minigames"],
    category: "simulation",
    playUrl: "#"
  }
]);
