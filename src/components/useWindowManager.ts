import { ref } from "vue";
import { useStorage } from "@vueuse/core";

export default function () {
  interface WindowPosition {
    x: number;
    y: number;
  }

  interface WindowSize {
    width: number;
    height: number;
  }

  interface WindowItem {
    id: number;
    type: string;
    position: WindowPosition;
    size: WindowSize;
    zIndex: number;
    minimized: boolean;
  }

  const windows = ref(useStorage<WindowItem[]>("tissuepackos-windows", []));
  const zIndexCounter = ref(1);

  const openWindow = (type: string): void => {
    const id: number = Date.now();
    windows.value.push({
      id,
      type,
      position: { x: 100, y: 100 },
      size: { width: 600, height: 400 },
      zIndex: zIndexCounter.value++,
      minimized: false
    } as WindowItem);
  };

  const closeWindow = (id: number) => {
    windows.value = windows.value.filter(w => w.id !== id);
  };

  const focusWindow = (id: number) => {
    windows.value.forEach(w => {
      w.zIndex = w.id === id ? zIndexCounter.value++ : w.zIndex;
    });
  };

  return { windows, openWindow, closeWindow, focusWindow };
}
