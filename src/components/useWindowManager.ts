import { ref } from "vue";
import { useStorage } from "@vueuse/core";

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

export default function () {
  const windows = ref(useStorage<WindowItem[]>("tissuepackos-windows", []));
  const zIndexCounter = ref(1);

  function createWindow(type: string): WindowItem {
    return {
      id: Date.now(),
      type,
      position: {
        x: 100 + windows.value.length * 20,
        y: 100 + windows.value.length * 20
      },
      size: { width: 600, height: 400 },
      zIndex: zIndexCounter.value++,
    }
  }

  const openWindow = (type: string) => {
    const newWindow = createWindow(type)
    windows.value.push(newWindow)
    return newWindow.id
  };

  const closeWindow = (id: number) => {
    windows.value = windows.value.filter(w => w.id !== id);
  };

  const focusWindow = (id: number) => {
    windows.value.forEach(w => {
      w.zIndex = w.id === id ? zIndexCounter.value++ : w.zIndex;
    });
  };

  return { windows, openWindow, closeWindow, focusWindow, zIndexCounter, createWindow };
}
