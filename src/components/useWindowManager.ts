import { ref } from "vue";
import { useStorage } from "@vueuse/core";
import { getAppByType, type AppConfig } from "../config/app.ts";

// Default window dimensions
const DEFAULT_WIDTH = 500;
const DEFAULT_HEIGHT = 320;

interface WindowPosition {
  x: number;
  y: number;
}

interface WindowSize {
  width: number;
  height: number;
}

// Define window interface
export interface WindowItem {
  id: number;
  type: string;
  position: WindowPosition;
  size: WindowSize;
  mobileSize?: {
    height: number;
  };
  zIndex: number;
  title: string;
  icon: string;
}

export default function useWindowManager() {
  const windows = ref(useStorage<WindowItem[]>("os-windows", []));
  const zIndexCounter = ref(1);

  function createWindow(type: string, appConfig?: AppConfig): WindowItem {
    // If appConfig is not provided, fetch it based on the type
    appConfig = appConfig || getAppByType(type);
    if (!appConfig) {
      throw new Error(`No app configuration found for type: ${type}`);
    }
    const position = {
      x: Math.random() * (window.innerWidth - (appConfig.width || DEFAULT_WIDTH)),
      y: Math.random() * (window.innerHeight - (appConfig.height || DEFAULT_HEIGHT))
    }
    return {
      id: Date.now(),
      type: appConfig.type,
      position,
      size: {
        // Use configured dimensions or defaults
        width: appConfig.width || DEFAULT_WIDTH,
        height: appConfig.height || DEFAULT_HEIGHT
      },
      zIndex: zIndexCounter.value++,
      title: appConfig.title,
      icon: appConfig.icon,
      mobileSize: appConfig.mobileSize
    };
  }

  const openWindow = (type: string, appConfig?: AppConfig) => {
    appConfig = appConfig || getAppByType(type);
    if (!appConfig) {
      throw new Error(`No app configuration found for type: ${type}`);
    }
    const newWindow = createWindow(type, appConfig);
    windows.value.push(newWindow);
    return newWindow.id;
  };

  const closeWindow = (id: number) => {
    windows.value = windows.value.filter(w => w.id !== id);
  };

  const focusWindow = (id: number) => {
    windows.value.forEach(w => {
      w.zIndex = w.id === id ? zIndexCounter.value++ : w.zIndex;
    });
  };

  //update window position and size
  const updateWindowState = (id: number, position: WindowPosition) => {
    windows.value = windows.value.map(window => {
      if (window.id === id) {
        return {
          ...window,
          position
        };
      }
      return window;
    });
  };

  return {
    windows,
    openWindow,
    closeWindow,
    focusWindow,
    zIndexCounter,
    createWindow,
    updateWindowState
  };
}
