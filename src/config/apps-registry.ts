import { defineAsyncComponent } from "vue";

import type { AppConfig } from "@/types";
import EmojioneGear from "@/icons/EmojioneGear.vue";
import FluentEmojiFlatFileFolder from "@/icons/FluentEmojiFlatFileFolder.vue";
import FluentEmojiFlatMusicalNote from "@/icons/FluentEmojiFlatMusicalNote.vue";
import FluentEmojiFlatNineOclock from "@/icons/FluentEmojiFlatNineOclock.vue";
import FluentEmojiFlatWomanTechnologistLight from "@/icons/FluentEmojiFlatWomanTechnologistLight.vue";
import GameIconsCalculator from "@/icons/GameIconsCalculator.vue";
import MdiClockDigital from "@/icons/MdiClockDigital.vue";
import SimpleIconsGnometerminal from "@/icons/SimpleIconsGnometerminal.vue";
import TwemojiSunBehindCloud from "@/icons/TwemojiSunBehindCloud.vue";

export const APPS: AppConfig[] = [
  {
    id: "about_me",
    label: "About Me",
    title: "About Me",
    component: defineAsyncComponent(() => import("@/components/apps/AboutMe.vue")),
    icon: FluentEmojiFlatWomanTechnologistLight,
    width: 600,
    height: 640,
    showOnDesktop: true,
  },
  {
    id: "projects",
    label: "Projects",
    title: "Code Projects",
    component: defineAsyncComponent(() => import("@/components/apps/ProjectsApp.vue")),
    icon: FluentEmojiFlatFileFolder,
    width: 720,
    height: 600,
    showOnDesktop: true,
  },
  {
    id: "terminal",
    label: "Terminal",
    title: "Terminal",
    component: defineAsyncComponent(() => import("@/components/apps/Terminal.vue")),
    icon: SimpleIconsGnometerminal,
    showOnDesktop: true,
  },
  {
    id: "weather",
    label: "Weather",
    title: "Weather",
    component: defineAsyncComponent(() => import("@/components/apps/Weather.vue")),
    icon: TwemojiSunBehindCloud,
    height: 320,
    showOnDesktop: true,
  },
  {
    id: "music",
    label: "Music Player",
    title: "Music Player",
    component: defineAsyncComponent(() => import("@/components/apps/MusicPlayer.vue")),
    icon: FluentEmojiFlatMusicalNote,
    height: 400,
    mobileSize: {
      height: 400,
    },
    showOnDesktop: true,
  },
  {
    id: "analogClock",
    label: "Analog Clock",
    title: "Analog Clock",
    component: defineAsyncComponent(() => import("@/components/apps/AnalogClock.vue")),
    icon: FluentEmojiFlatNineOclock,
    width: 240,
    height: 240,
    mobileSize: {
      height: 240,
    },
    showOnDesktop: true,
  },
  {
    id: "calculator",
    label: "Calculator",
    title: "Calculator",
    component: defineAsyncComponent(() => import("@/components/apps/Calculator.vue")),
    icon: GameIconsCalculator,
    width: 340,
    height: 360,
    mobileSize: {
      height: 360,
    },
    showOnDesktop: true,
  },
  {
    id: "digitalClock",
    label: "Digital Clock",
    title: "Digital Clock",
    component: defineAsyncComponent(() => import("@/components/apps/DigitalClock.vue")),
    icon: MdiClockDigital,
    width: 360,
    height: 80,
    mobileSize: {
      height: 80,
    },
    showOnDesktop: true,
  },
  {
    id: "settings",
    label: "Settings",
    title: "System Settings",
    component: defineAsyncComponent(() => import("@/components/apps/SettingsApp.vue")),
    icon: EmojioneGear,
    width: 720,
    height: 540,
    showOnDesktop: true,
  },
];

// Helper function to get app configuration by id
export const getAppById = (id: string) => {
  return APPS.find((app) => app.id === id);
};

export const getDesktopApps = () => {
  return APPS.filter((app) => app.showOnDesktop);
};

export const getIconById = (id: string) => {
  const app = getAppById(id);
  if (!app) {
    throw new Error(`No app configuration found for: ${id}`);
  }
  return app.icon;
};

export const getComponentById = (id: string) => {
  const app = getAppById(id);
  if (!app) {
    throw new Error(`No app configuration found for: ${id}`);
  }
  return app.component;
};
