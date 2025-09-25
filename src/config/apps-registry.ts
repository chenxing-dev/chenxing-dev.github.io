import { defineAsyncComponent } from "vue";

export interface AppConfig {
  id: string; // Unique app type identifier
  label: string; // Icon label
  title: string; // Window title
  component: any;
  icon: any;
  width?: number;
  height?: number;
  mobileSize?: {
    height: number;
  };
  showOnDesktop: boolean; // Whether the app should be shown on the desktop
}

export const APPS: AppConfig[] = [
  {
    id: "about_me",
    label: "About Me",
    title: "About Me",
    component: defineAsyncComponent(() => import("@/components/apps/AboutMe.vue")),
    icon: defineAsyncComponent(() => import("@/icons/FluentEmojiFlatWomanTechnologistLight.vue")),
    width: 720,
    height: 600,
    showOnDesktop: true,
  },
  {
    id: "projects",
    label: "Projects",
    title: "Code Projects",
    component: defineAsyncComponent(() => import("@/components/apps/ProjectsApp.vue")),
    icon: defineAsyncComponent(() => import("@/icons/FluentEmojiFlatFileFolder.vue")),
    width: 720,
    height: 600,
    showOnDesktop: true,
  },
  {
    id: "terminal",
    label: "Terminal",
    title: "Terminal",
    component: defineAsyncComponent(() => import("@/components/apps/Terminal.vue")),
    icon: defineAsyncComponent(() => import("@/icons/SimpleIconsGnometerminal.vue")),
    showOnDesktop: true,
  },
  {
    id: "weather",
    label: "Weather",
    title: "Weather",
    component: defineAsyncComponent(() => import("@/components/apps/Weather.vue")),
    icon: defineAsyncComponent(() => import("@/icons/TwemojiSunBehindCloud.vue")),
    height: 320,
    showOnDesktop: true,
  },
  {
    id: "music",
    label: "Music Player",
    title: "Music Player",
    component: defineAsyncComponent(() => import("@/components/apps/MusicPlayer.vue")),
    icon: defineAsyncComponent(() => import("@/icons/FluentEmojiFlatMusicalNote.vue")),
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
    icon: defineAsyncComponent(() => import("@/icons/FluentEmojiFlatNineOclock.vue")),
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
    icon: defineAsyncComponent(() => import("@/icons/GameIconsCalculator.vue")),
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
    icon: defineAsyncComponent(() => import("@/icons/MdiClockDigital.vue")),
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
    icon: defineAsyncComponent(() => import("@/icons/EmojioneGear.vue")),
    width: 720,
    height: 540,
    showOnDesktop: true,
  },
];

// Helper function to get app configuration by id
export const getAppById = (id: string) => {
  return APPS.find(app => app.id === id);
};

export const getDesktopApps = () => {
  return APPS.filter(app => app.showOnDesktop);
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
