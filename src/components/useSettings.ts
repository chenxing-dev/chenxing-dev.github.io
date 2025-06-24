import { ref, watch } from "vue";

// Define the settings interface
interface Settings {
  theme: string;
  background: string;
  iconSize: "small" | "medium" | "large";
  clockFormat: "12h" | "24h";
  customCSS: string;
}

export const useSettings = () => {
  // Default settings
  const defaultSettings: Settings = {
    theme: "minimal",
    background: "white",
    iconSize: "medium",
    clockFormat: "24h",
    customCSS: ""
  };

  // Load settings from localStorage or use defaults
  const settings = ref<Settings>({
    ...defaultSettings,
    ...JSON.parse(localStorage.getItem("tissuePackOS_settings") || "{}")
  });

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem("tissuePackOS_settings", JSON.stringify(settings.value));
  };

  // Watch for changes and save automatically
  watch(settings, saveSettings, { deep: true });

  return {
    settings,
    saveSettings
  };
};
