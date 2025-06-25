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
  width?: number; // Optional width for embedded games
  height?: number; // Optional height for embedded games
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
    playUrl: "https://chenxing-dev.github.io/jumping-dino/"
  },
  // Sample game data
  {
    id: "quantum-puzzle",
    title: "Quantum Puzzle",
    icon: "🧩",
    genre: "Puzzle",
    description: "Mind-bending puzzle game with quantum mechanics concepts.",
    longDescription: "Quantum Puzzle challenges players to solve spatial puzzles using quantum superposition principles. Manipulate objects in multiple states simultaneously across parallel dimensions. Features a unique visual style and progressively complex mechanics that teach real quantum concepts through gameplay.",
    thumbnail: "/images/quantum-puzzle.png",
    tech: ["Unity", "C#", "Shader Graph"],
    features: ["80+ challenging puzzles", "Quantum mechanics-based gameplay", "Minimalist aesthetic design", "Procedural puzzle generation", "Educational content integrated"],
    playUrl: "#",
    width: 400,
    height: 400
  },
  {
    id: "neon-drift",
    icon: "🏎️",
    title: "Neon Drift",
    genre: "Racing",
    description: "Futuristic racing game with neon visuals and synthwave soundtrack.",
    longDescription: "Neon Drift combines high-speed racing with rhythm game elements. Drift through neon-lit cityscapes to the beat of an original synthwave soundtrack. Features a track editor, multiplayer races, and a dynamic difficulty system that adapts to your skill level.",
    thumbnail: "/images/neon-drift.png",
    tech: ["Unreal", "C++", "Blueprint"],
    features: ["12 unique racing tracks", "Dynamic soundtrack integration", "Track editor with sharing", "Online multiplayer races", "Customizable vehicles"],
    playUrl: "#"
  },
  {
    id: "realm-of-echoes",
    icon: "🌌",
    title: "Realm of Echoes",
    genre: "RPG",
    description: "Story-driven RPG with branching narratives and tactical combat.",
    longDescription: "Realm of Echoes is an isometric RPG featuring deep character customization, meaningful choices, and tactical turn-based combat. Explore a handcrafted world full of rich lore, complex characters, and challenging moral dilemmas. Every decision shapes your journey through this narrative-rich adventure.",
    thumbnail: "/images/realm-of-echoes.png",
    tech: ["RPG Maker", "JavaScript", "Pixel Art"],
    features: ["40+ hours of gameplay", "Branching narrative with 8 endings", "Tactical turn-based combat", "Deep character progression", "Original orchestral soundtrack"],
    playUrl: "#"
  },
  {
    id: "tower-tactics",
    icon: "🛡️",
    title: "Tower Tactics",
    genre: "Strategy",
    description: "Tower defense with deep strategy and base-building elements.",
    longDescription: "Tower Tactics reinvents the tower defense genre with base-building mechanics and resource management. Design your defenses, manage resources, and deploy special abilities to fend off increasingly challenging waves of enemies. Features procedurally generated maps and daily challenges.",
    thumbnail: "/images/tower-tactics.png",
    tech: ["Phaser", "TypeScript", "WebGL"],
    features: ["Procedurally generated maps", "30+ unique tower types", "Resource management system", "Daily challenge modes", "Endless survival mode"],
    playUrl: "#"
  },
  {
    id: "pixel-paws",
    icon: "🐾",
    title: "Pixel Paws",
    genre: "Simulation",
    description: "Wholesome pet simulator with pixel art animals and cozy gameplay.",
    longDescription: "Pixel Paws is a cozy pet simulation game where you care for adorable pixel art animals. Build your dream pet sanctuary, nurture your companions, and participate in fun minigames. Features a day/night cycle, changing seasons, and a heartwarming story about friendship.",
    thumbnail: "/images/pixel-paws.png",
    tech: ["Unity", "C#", "Aseprite"],
    features: ["15+ unique pets to care for", "Customizable sanctuary", "Day/night and seasonal cycles", "Heartwarming storyline", "Relaxing minigames"],
    playUrl: "#"
  }
]);
