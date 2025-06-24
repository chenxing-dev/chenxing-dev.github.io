import { useStorage } from "@vueuse/core";

// Define the settings interface
interface Settings {
  theme: string;
  background: string;
  iconSize: "small" | "medium" | "large";
  clockFormat: "12h" | "24h";
  customCSS: string;
}

// Default settings
export const defaultSettings: Settings = {
  theme: "minimal",
  background: "white",
  iconSize: "medium",
  clockFormat: "24h",
  customCSS: ""
};

export const useSettings = () => {
  // Load settings from storage or use defaults
  const settings = useStorage<Settings>("os-settings", defaultSettings, undefined, { mergeDefaults: true });
  // Return the settings object
  return {
    settings
  };
};
