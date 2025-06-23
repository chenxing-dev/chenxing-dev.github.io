import { defineAsyncComponent } from "vue";

export interface AppConfig {
  type: string;
  icon: string;
  label: string;
  title: string;
  component: any;
  width?: number;
  height?: number;
}

export const appConfigs: AppConfig[] = [
  {
    type: "gaming",
    icon: "🎮",
    label: "Games",
    title: "Gaming Library",
    component: defineAsyncComponent(() => import("../components/windows/GamingWindow.vue"))
  },
  {
    type: "terminal",
    icon: "🐧",
    label: "Terminal",
    title: "Terminal",
    component: defineAsyncComponent(() => import("../components/windows/TerminalWindow.vue"))
  },
  {
    type: "music",
    icon: "🎵",
    label: "Music Player",
    title: "Music Player",
    component: defineAsyncComponent(() => import("../components/windows/MusicPlayer.vue")),
  },
  {
    type: "code_projects",
    icon: "💻",
    label: "Projects",
    title: "Code Projects",
    component: defineAsyncComponent(() => import("../components/windows/ProjectsWindow.vue"))
  },
  {
    type: "about_me",
    icon: "👤",
    label: "About",
    title: "About Me",
    component: defineAsyncComponent(() => import("../components/windows/AboutWindow.vue"))
  },
  {
    type: "contact",
    icon: "✉️",
    label: "Contact",
    title: "Contact",
    component: defineAsyncComponent(() => import("../components/windows/ContactWindow.vue"))
  },
  {
    type: "clock",
    icon: "🕒",
    label: "Clock",
    title: "Clock",
    component: defineAsyncComponent(() => import("../components/windows/ClockWindow.vue")),
    width: 360,
    height: 80
  },
  {
    type: "settings",
    icon: "⚙️",
    label: "Settings",
    title: "System Settings",
    component: defineAsyncComponent(() => import("../components/windows/SettingsWindow.vue")),
    width: 800,
    height: 540
  }
];

// Helper functions for accessing app config
export const getAppByType = (type: string) => {
  return appConfigs.find(app => app.type === type);
};

export const getDesktopApps = () => {
  return appConfigs.map(({ type, icon, label }) => ({ type, icon, label }));
};

export const getWindowTitle = (type: string) => {
  const app = getAppByType(type);
  return app ? app.title : "Untitled Window";
};

export const getWindowIcon = (type: string) => {
  const app = getAppByType(type);
  return app ? app.icon : "❓";
};

export const getWindowComponent = (type: string) => {
  const app = getAppByType(type);
  return app ? app.component : null;
};
