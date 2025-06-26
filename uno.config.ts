import { defineConfig } from "unocss";
import presetWind4 from "@unocss/preset-wind4";

// Define themes
const themes = {
  minimal: {
    primary: "#3f3f46",
    secondary: "#71717a",
    background: "#fafafa",
    text: "#18181b",
    border: "#09090b"
  },
  dark: {
    primary: "#818cf8",
    secondary: "#a5b4fc",
    background: "#111827",
    text: "#f9fafb",
    border: "#374151"
  },
  blue: {
    primary: "#2563eb",
    secondary: "#3b82f6",
    background: "#dbeafe",
    text: "#1e40af",
    border: "#93c5fd"
  },
  green: {
    primary: "#059669",
    secondary: "#10b981",
    background: "#d1fae5",
    text: "#065f46",
    border: "#a7f3d0"
  }
};

export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        reset: true
      }
    })
  ],
  theme: {
    colors: {
      // Set default theme
      ...themes.minimal
    }
  }
});
