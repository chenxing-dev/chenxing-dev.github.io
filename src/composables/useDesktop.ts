import { ref, computed } from "vue";
import { useStorage } from "@vueuse/core";
import { getAppByType, type AppConfig } from "@/config/app.ts";

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
  app: AppItem;
  position: WindowPosition;
  zIndex: number;
}

// Define app interface
interface AppItem {
  type: string;
  title: string;
  icon: string;
  size: WindowSize;
  mobileSize?: {
    height: number;
  };
}

export default function useDesktop() {
  // Persistent storage for open windows
  const windows = useStorage<WindowItem[]>("os-windows", []);

  // Z-index counter to manage window stacking order
  const zIndexCounter = ref(1);
  const activeWindowId = ref<number | null>(null);

  const activeWindow = computed(() =>
    windows.value.slice().sort((a, b) => b.zIndex - a.zIndex)[0] || null
  );

  function createWindow(app: AppItem): WindowItem {
    const position = {
      x: Math.random() * (window.innerWidth - (app.size.width || DEFAULT_WIDTH)),
      y: Math.random() * (window.innerHeight - (app.size.height || DEFAULT_HEIGHT))
    }
    return {
      id: Date.now(),
      app,
      position,
      zIndex: zIndexCounter.value++, // Increment zIndex for new window
    };
  }

  const openWindow = (type: string, appConfig?: AppConfig) => {
    appConfig = appConfig || getAppByType(type);
    if (!appConfig) {
      throw new Error(`No app configuration found for type: ${type}`);
    }
    const newWindow = createWindow({
      type: appConfig.type,
      title: appConfig.title,
      icon: appConfig.icon,
      size: {
        // Use configured dimensions or defaults
        width: appConfig.width || DEFAULT_WIDTH,
        height: appConfig.height || DEFAULT_HEIGHT
      },
      mobileSize: appConfig.mobileSize,
    });
    windows.value.push(newWindow);
    focusWindow(newWindow.id);
    return newWindow.id;
  };

  const closeWindow = (id: number) => {
    windows.value = windows.value.filter(w => w.id !== id);
    if (activeWindowId.value === id) {
      // If the closed window was active, 
      // set activeWindowId to the next topmost window
      const topWindow = activeWindow.value;
      activeWindowId.value = topWindow ? topWindow.id : null;
    }
  };

  const focusWindow = (id: number) => {
    // Bring to front by updating zIndex
    windows.value.forEach(w => {
      if (w.id === id) {
        w.zIndex = zIndexCounter.value++;
        activeWindowId.value = id;
      }
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
    updateWindowState,
    activeWindowId,
    activeWindow
  };
}
