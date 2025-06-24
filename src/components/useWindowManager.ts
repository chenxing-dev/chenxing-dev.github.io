import { ref } from "vue";
import { useStorage } from "@vueuse/core";
import { getAppByType } from "../config/app.ts";

// Default window dimensions
const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 400;

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
  zIndex: number;
}

export default function useWindowManager() {
  const windows = ref(useStorage<WindowItem[]>("os-windows", []));
  const zIndexCounter = ref(1);

  function createWindow(type: string): WindowItem {
    const appConfig = getAppByType(type);
    if (!appConfig) {
      throw new Error(`No app configuration found for type: ${type}`);
    }
    return {
      id: Date.now(),
      type,
      position: {
        x: Math.random() * (window.innerWidth - (appConfig.width || DEFAULT_WIDTH)),
        y: Math.random() * (window.innerHeight - (appConfig.height || DEFAULT_HEIGHT))
      },
      size: {
        // Use configured dimensions or defaults
        width: appConfig.width || DEFAULT_WIDTH,
        height: appConfig.height || DEFAULT_HEIGHT
      },
      zIndex: zIndexCounter.value++
    };
  }

  const openWindow = (type: string) => {
    const newWindow = createWindow(type);
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
        }
      }
      return window
    })
  }

  return {
    windows, openWindow, closeWindow, focusWindow, zIndexCounter, createWindow,
    updateWindowState
  };
}
