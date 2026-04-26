import { ref, computed } from "vue";
import { useStorage } from "@vueuse/core";
import { getAppById } from "@/config/apps-registry";
import { clampWindowPosition, sanitizeAndRehydrate } from "@/lib/stored-window";
import type { AppConfig, AppItem, StoredWindow, WindowItem, WindowPosition } from "@/types";

// Default window dimensions
const DEFAULT_WIDTH = 500;
const DEFAULT_HEIGHT = 320;
// Safety margin to account for window borders, shadows, and UI chrome
const START_POSITION_MARGIN = 16;

// Helper to get the topmost window based on the highest zIndex; returns null if no windows
const getTopWindow = (windowList: WindowItem[]) => {
  return windowList.reduce<WindowItem | null>((topWindow, windowItem) => {
    if (!topWindow || windowItem.zIndex > topWindow.zIndex) {
      return windowItem;
    }
    return topWindow;
  }, null);
};

// Persistent storage for open windows using a serializer
// Store only a lightweight snapshot in localStorage and rehydrate to full WindowItem[] in app
const windows = useStorage<WindowItem[]>("os-windows", [], undefined, {
  serializer: {
    read: (v: string): WindowItem[] => {
      try {
        const parsed = v ? (JSON.parse(v) as unknown) : [];
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
});

// Make bootstrap idempotent aka only run once
let bootstrapped = false;

// Z-index ref
const zIndexCounter = ref(1);

export default function useWindowState() {
  // Bootstrap once per module load
  if (!bootstrapped) {
    zIndexCounter.value = Math.max(1, ...windows.value.map((w) => w.zIndex)) + 1;
    bootstrapped = true;
  }

  // Computed active window
  const activeWindow = computed(() => getTopWindow(windows.value));

  function createWindow(app: AppItem, startPosition?: WindowPosition): WindowItem {
    const position = clampWindowPosition(
      startPosition ??
        (() => {
          const maxX = Math.max(
            0,
            window.innerWidth - (app.size.width || DEFAULT_WIDTH) - START_POSITION_MARGIN,
          );
          const maxY = Math.max(
            0,
            window.innerHeight - (app.size.height || DEFAULT_HEIGHT) - START_POSITION_MARGIN,
          );
          return { x: Math.random() * maxX, y: Math.random() * maxY };
        })(),
      app.size,
    );
    return {
      id: Date.now(),
      app,
      position,
      zIndex: zIndexCounter.value++, // Increment zIndex for new window
    };
  }

  const openWindow = (id: string, appConfig?: AppConfig, startPosition?: WindowPosition) => {
    appConfig = appConfig || getAppById(id);
    if (!appConfig) {
      throw new Error(`No app configuration found for: ${id}`);
    }
    const newWindow = createWindow(
      {
        id: appConfig.id,
        title: appConfig.title,
        size: {
          // Use configured dimensions or defaults
          width: appConfig.width || DEFAULT_WIDTH,
          height: appConfig.height || DEFAULT_HEIGHT,
        },
        mobileSize: appConfig.mobileSize,
      },
      startPosition,
    );
    windows.value.push(newWindow);
    focusWindow(newWindow.id);
    return newWindow.id;
  };

  const closeWindow = (id: number) => {
    windows.value = windows.value.filter((w) => w.id !== id);
  };

  const focusWindow = (id: number) => {
    // Bring to front by updating zIndex
    windows.value.forEach((w) => {
      if (w.id === id) {
        w.zIndex = zIndexCounter.value++;
      }
    });
  };

  //update window position and size
  const updateWindowState = (id: number, position: WindowPosition) => {
    windows.value = windows.value.map((window) => {
      if (window.id === id) {
        return {
          ...window,
          position,
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
    activeWindow,
  };
}
