import { defineAsyncComponent } from "vue";
import { games } from "./games";

export interface AppConfig {
  showOnDesktop: boolean; // Whether the app should be shown on the desktop
  type: string;
  icon: string;
  label: string;
  title: string;
  component: any;
  width?: number;
  height?: number;
  mobileSize?: {
    height: number;
  };
}

export const appConfigs: AppConfig[] = [
  {
    showOnDesktop: true,
    type: "gaming",
    icon: "🎮",
    label: "Games",
    title: "Gaming Library",
    component: defineAsyncComponent(() => import("../components/windows/GamingWindow.vue"))
  },
  {
    showOnDesktop: true,
    type: "terminal",
    icon: "🐧",
    label: "Terminal",
    title: "Terminal",
    component: defineAsyncComponent(() => import("../components/windows/TerminalWindow.vue"))
  },
  {
    showOnDesktop: true,
    type: "music",
    icon: "🎵",
    label: "Music Player",
    title: "Music Player",
    component: defineAsyncComponent(() => import("../components/windows/MusicPlayer.vue")),
    mobileSize: {
      height: 400
    }
  },
  {
    showOnDesktop: true,
    type: "code_projects",
    icon: "💻",
    label: "Projects",
    title: "Code Projects",
    component: defineAsyncComponent(() => import("../components/windows/ProjectsWindow.vue")),
    height: 600,
  },
  {
    showOnDesktop: true,
    type: "about_me",
    icon: "👤",
    label: "About",
    title: "About Me",
    component: defineAsyncComponent(() => import("../components/windows/AboutWindow.vue"))
  },
  {
    showOnDesktop: true,
    type: "contact",
    icon: "✉️",
    label: "Contact",
    title: "Contact",
    component: defineAsyncComponent(() => import("../components/windows/ContactWindow.vue"))
  },
  {
    showOnDesktop: true,
    type: "digitalClock",
    icon: "⏰",
    label: "Digital Clock",
    title: "Digital Clock",
    component: defineAsyncComponent(() => import("../components/windows/DigitalClock.vue")),
    width: 360,
    height: 80,
    mobileSize: {
      height: 80
    }
  },
  {
    showOnDesktop: true,
    type: "analogClock",
    icon: "🕰️",
    label: "Analog Clock",
    title: "Analog Clock",
    component: defineAsyncComponent(() => import("../components/windows/AnalogClock.vue")),
    width: 240,
    height: 240,
    mobileSize: {
      height: 240
    }
  },
  {
    showOnDesktop: true,
    type: "settings",
    icon: "⚙️",
    label: "Settings",
    title: "System Settings",
    component: defineAsyncComponent(() => import("../components/windows/SettingsWindow.vue")),
    width: 720,
    height: 540
  },
  ...games.value.map(game => ({
    showOnDesktop: false, // Games are not shown on desktop by default
    type: game.id,
    icon: game.icon || "🎮",
    label: game.title,
    title: game.title,
    component: defineAsyncComponent(() => import("../components/windows/GamePlayerWindow.vue")),
    width: 800,
    height: 600,
  }))
];

// Helper functions for accessing app config
export const getAppByType = (type: string) => {
  return appConfigs.find(app => app.type === type);
};

export const getDesktopApps = () => {
  return appConfigs.map(({ showOnDesktop, type, icon, label }) => ({ showOnDesktop, type, icon, label }));
};

export const getComponentByType = (type: string) => {
  const app = getAppByType(type);
  if (!app) {
    throw new Error(`No app configuration found for type: ${type}`);
  }
  return app.component;
};
