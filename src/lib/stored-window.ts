import { getAppById } from "@/config/apps-registry";
import { clamp, isFiniteNumber } from "@/lib/number";
import type { AppItem, StoredWindow, WindowItem, WindowPosition } from "@/types";

const DEFAULT_WIDTH = 500;
const DEFAULT_HEIGHT = 320;
const START_POSITION_MARGIN = 16;

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

      const position: WindowPosition = {
        x: clamp(
          item.position.x,
          0,
          (typeof window !== "undefined" ? window.innerWidth : app.width || DEFAULT_WIDTH) -
            (app.width || DEFAULT_WIDTH) -
            START_POSITION_MARGIN,
        ),
        y: clamp(
          item.position.y,
          0,
          (typeof window !== "undefined" ? window.innerHeight : app.height || DEFAULT_HEIGHT) -
            (app.height || DEFAULT_HEIGHT) -
            START_POSITION_MARGIN,
        ),
      };

      const rehydratedApp: AppItem = {
        id: app.id,
        title: app.title,
        size: {
          width: app.width || DEFAULT_WIDTH,
          height: app.height || DEFAULT_HEIGHT,
        },
        mobileSize: app.mobileSize,
      };

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
