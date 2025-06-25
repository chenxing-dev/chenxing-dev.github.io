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
    playUrl: "https://chenxing-dev.github.io/jumping-dino/",
    width: 720,
    height: 540
  },
  // Sample game data
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
    width: 400,
    height: 400
  },
  {
    id: "neon-drift",
    icon: "🏎️",
    title: "Neon Drift",
    genre: "Racing",
    description: "Futuristic racing game with neon visuals and synthwave soundtrack.",
    longDescription: "Neon Drift combines high-speed racing with rhythm game elements. Drift through neon-lit cityscapes to the beat of an original synthwave soundtrack. Customize your vehicle, unlock new tracks, and compete for the best times in this adrenaline-pumping racing experience. ",
    thumbnail: "/images/neon-drift.png",
    tech: ["Unity", "C#", "Shader Graph"],
    features: ["12 unique racing tracks", "Customizable vehicles"],
    playUrl: "#"
  },
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
    title: "Bloodfall",
    genre: "Strategy",
    description: "Tower defense game with fantasy elements and blood magic.",
    thumbnail: "/images/bloodfall.png",
    longDescription: "Bloodfall is a tower defense game set in a dark fantasy world, where you play as an evil sorcerer defending your lair from invading heroes. Use blood magic to summon powerful demons, harness dark spells, and wield ancient artifacts to fend off waves of soldiers, druids, and paladins.",
    features: ["Unique blood magic mechanics", "Questionable moral choices", "Randomly generated levels"],
    id: "bloodfall",
    icon: "🩸",
    tech: ["Phaser", "TypeScript", "WebGL"],
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
