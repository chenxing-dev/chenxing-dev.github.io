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
  }
]);
