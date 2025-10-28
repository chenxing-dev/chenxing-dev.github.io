import { ref, computed } from "vue";
import { useStorage } from "@vueuse/core";
import { getAppById } from "@/config/apps-registry";
import type { AppConfig, AppItem, StoredWindow, WindowItem, WindowPosition } from "@/types";

// Default window dimensions
const DEFAULT_WIDTH = 500;
const DEFAULT_HEIGHT = 320;

// Clamp helpers
const clamp = (n: number, min: number, max: number) => {
  return Math.min(Math.max(n, min), max);
}

// Convert persisted window to full window object
export const sanitizeAndRehydrate = (stored: StoredWindow[] | unknown): WindowItem[] => {
  const list = Array.isArray(stored) ? stored : [];

  return list.map((item: any) => {
    const appId = item.appId ?? item.app?.id;
    const app = appId ? getAppById(appId) : undefined;
    if (!app) {
      return null;
    }

    // Clamp position to viewport
    const position: WindowPosition = {
      x: clamp(item.position.x, 0, (typeof window !== 'undefined' ? window.innerWidth : app.width || DEFAULT_WIDTH) - (app.width || DEFAULT_WIDTH)),
      y: clamp(item.position.y, 0, (typeof window !== 'undefined' ? window.innerHeight : app.height || DEFAULT_HEIGHT) - (app.height || DEFAULT_HEIGHT))
    };

    const rehydratedApp: AppItem = {
      id: app.id,
      title: app.title,
      icon: app.icon,
      size: {
        width: app.width || DEFAULT_WIDTH,
        height: app.height || DEFAULT_HEIGHT
      },
      mobileSize: app.mobileSize,
    };

    const windowItem: WindowItem = {
      id: item.id,
      zIndex: item.zIndex,
      app: rehydratedApp,
      position
    };

    return windowItem;
  }).filter((w): w is WindowItem => w !== null);
}

// Persistent storage for open windows using a serializer
// Store only a lightweight snapshot in localStorage and rehydrate to full WindowItem[] in app
const windows = useStorage<WindowItem[]>(
  "os-windows",
  [],
  undefined,
  {
    serializer: {
      read: (v: string): WindowItem[] => {
        try {
          const parsed = v ? JSON.parse(v) as unknown : [];
          return sanitizeAndRehydrate(parsed as StoredWindow[]);
        } catch {
          return [];
        }
      },
      write: (value: WindowItem[]): string => {
        const snapshots: StoredWindow[] = value.map((w) => ({
          id: w.id,
          appId: w.app.id,
          position: w.position,
          zIndex: w.zIndex,
        }));
        return JSON.stringify(snapshots);
      },
    },
  }
);

// Make bootstrap idempotent aka only run once
let bootstrapped = false;

// Z-index and active refs
const zIndexCounter = ref(1);
const activeWindowId = ref<number | null>(null);

export default function useDesktop() {
  // Bootstrap once per module load
  if (!bootstrapped) {
    zIndexCounter.value = Math.max(1, ...windows.value.map(w => w.zIndex)) + 1;
    activeWindowId.value = windows.value.length ? windows.value[windows.value.length - 1].id : null;
    bootstrapped = true;
  }

  // Computed active window
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

  const openWindow = (id: string, appConfig?: AppConfig) => {
    appConfig = appConfig || getAppById(id);
    if (!appConfig) {
      throw new Error(`No app configuration found for: ${id}`);
    }
    const newWindow = createWindow({
      id: appConfig.id,
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
