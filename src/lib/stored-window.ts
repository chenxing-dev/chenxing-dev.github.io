import { getAppById } from "@/config/apps-registry";
import { clamp, isFiniteNumber } from "@/lib/number";
import type { AppItem, StoredWindow, WindowItem, WindowPosition, WindowSize } from "@/types";

const DEFAULT_WIDTH = 500;
const DEFAULT_HEIGHT = 320;
const START_POSITION_MARGIN = 16;

export const clampWindowPosition = (
  position: WindowPosition,
  size: WindowSize,
): WindowPosition => {
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : size.width;
  const viewportHeight = typeof window !== "undefined" ? window.innerHeight : size.height;
  const maxX = Math.max(0, viewportWidth - size.width - START_POSITION_MARGIN);
  const maxY = Math.max(0, viewportHeight - size.height - START_POSITION_MARGIN);

  return {
    x: clamp(position.x, 0, maxX),
    y: clamp(position.y, 0, maxY),
  };
};

const isWindowPosition = (value: unknown): value is WindowPosition => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const position = value as Partial<WindowPosition>;
  return isFiniteNumber(position.x) && isFiniteNumber(position.y);
};

const isStoredWindow = (value: unknown): value is StoredWindow => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Partial<StoredWindow>;
  return (
    isFiniteNumber(record.id) &&
    isFiniteNumber(record.zIndex) &&
    isWindowPosition(record.position) &&
    typeof record.appId === "string"
  );
};

const parseStoredWindow = (value: unknown, index: number): StoredWindow | null => {
  if (!isStoredWindow(value)) {
    console.warn(
      `[os-windows] Invalid persisted window at index ${index} — skipping malformed entry`,
    );
    return null;
  }

  return value;
};

export const sanitizeAndRehydrate = (stored: StoredWindow[] | unknown): WindowItem[] => {
  const list = Array.isArray(stored) ? stored : [];

  return list
    .map((value, index) => {
      const item = parseStoredWindow(value, index);
      if (!item) {
        return null;
      }

      const app = getAppById(item.appId);
      if (!app) {
        console.warn(
          `[os-windows] Unknown app id in storage: ${item.appId} — skipping window ${item.id}`,
        );
        return null;
      }

      const rehydratedApp: AppItem = {
        id: app.id,
        title: app.title,
        size: {
          width: app.width || DEFAULT_WIDTH,
          height: app.height || DEFAULT_HEIGHT,
        },
        mobileSize: app.mobileSize,
      };

      const position = clampWindowPosition(item.position, rehydratedApp.size);

      const windowItem: WindowItem = {
        id: item.id,
        zIndex: item.zIndex,
        app: rehydratedApp,
        position,
      };

      return windowItem;
    })
    .filter((windowItem): windowItem is WindowItem => windowItem !== null);
};
