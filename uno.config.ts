import { defineConfig } from "unocss";
import presetWind4 from "@unocss/preset-wind4";

export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        reset: true
      }
    })
  ],
  shortcuts: {
    "desktop-icon": "flex flex-col items-center cursor-pointer w-16 text-center",
    "window-button": "w-3 h-3 rounded-full mr-1"
  },
  theme: {
    colors: {
      "os-blue": "#4a6fa5",
      "os-dark": "#2c3e50",
      "os-gray": "#ecf0f1"
    }
  }
});
