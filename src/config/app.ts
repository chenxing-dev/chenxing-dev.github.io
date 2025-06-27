import { defineAsyncComponent } from "vue";
import { games } from "./games";

export interface AppConfig {
  showOnDesktop: boolean; // Whether the app should be shown on the desktop
  type: string;
  icon: any;
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
    icon: defineAsyncComponent(() => import("../icons/TwemojiVideoGame.vue")),
    label: "Games",
    title: "Gaming Library",
    component: defineAsyncComponent(() => import("../components/windows/GamingWindow.vue"))
  },
  {
    showOnDesktop: true,
    type: "code_projects",
    icon: defineAsyncComponent(() => import("../icons/FluentEmojiFlatFileFolder.vue")),
    label: "Projects",
    title: "Code Projects",
    component: defineAsyncComponent(() => import("../components/windows/ProjectsWindow.vue")),
    height: 600
  },
  {
    showOnDesktop: true,
    type: "terminal",
    icon: defineAsyncComponent(() => import("../icons/SimpleIconsGnometerminal.vue")),
    label: "Terminal",
    title: "Terminal",
    component: defineAsyncComponent(() => import("../components/windows/TerminalWindow.vue"))
  },
  {
    showOnDesktop: true,
    type: "weather",
    icon: defineAsyncComponent(() => import("../icons/TwemojiSunBehindCloud.vue")),
    label: "Weather",
    title: "Weather",
    component: defineAsyncComponent(() => import("../components/windows/WeatherWindow.vue"))
  },
  {
    showOnDesktop: true,
    type: "music",
    icon: defineAsyncComponent(() => import("../icons/FluentEmojiFlatMusicalNote.vue")),
    label: "Music Player",
    title: "Music Player",
    component: defineAsyncComponent(() => import("../components/windows/MusicPlayer.vue")),
    height: 400,
    mobileSize: {
      height: 400
    }
  },
  {
    showOnDesktop: true,
    type: "pictures",
    icon: defineAsyncComponent(() => import("../icons/FluentEmojiFlatFramedPicture.vue")),
    label: "Pictures",
    title: "Pictures",
    component: defineAsyncComponent(() => import("../components/windows/PicturesWindow.vue"))
  },
  {
    showOnDesktop: true,
    type: "digitalClock",
    icon: defineAsyncComponent(() => import("../icons/MdiClockDigital.vue")),
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
    icon: defineAsyncComponent(() => import("../icons/FluentEmojiFlatNineOclock.vue")),
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
    icon: defineAsyncComponent(() => import("../icons/EmojioneGear.vue")),
    label: "Settings",
    title: "System Settings",
    component: defineAsyncComponent(() => import("../components/windows/SettingsWindow.vue")),
    width: 720,
    height: 540
  },
  ...games.value.map(game => ({
    showOnDesktop: false, // Games are not shown on desktop by default
    type: game.id,
    icon: defineAsyncComponent(() => import("../icons/FluentEmojiFlatFileFolder.vue")),
    label: game.title,
    title: game.title,
    component: defineAsyncComponent(() => import("../components/windows/GamePlayerWindow.vue")),
    width: 800,
    height: 600
  }))
];

// Helper functions for accessing app config
export const getAppByType = (type: string) => {
  return appConfigs.find(app => app.type === type);
};

export const getDesktopApps = () => {
  return appConfigs.map(({ showOnDesktop, type, icon, label }) => ({ showOnDesktop, type, icon, label }));
};

export const getIconByType = (type: string) => {
  const app = getAppByType(type);
  if (!app) {
    throw new Error(`No app configuration found for type: ${type}`);
  }
  return app.icon;
};

export const getComponentByType = (type: string) => {
  const app = getAppByType(type);
  if (!app) {
    throw new Error(`No app configuration found for type: ${type}`);
  }
  return app.component;
};
