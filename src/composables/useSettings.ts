import { useStorage } from "@vueuse/core";

// Define the settings interface
interface Settings {
  theme: string;
  background: string;
  clockFormat: "12h" | "24h";
}

// Default settings
export const defaultSettings: Settings = {
  theme: "theme-minimal",
  background: "bg-off-white",
  clockFormat: "24h"
};

export const useSettings = () => {
  // Load settings from storage or use defaults
  const settings = useStorage<Settings>("os-settings", defaultSettings, undefined, { mergeDefaults: true });
  // Return the settings object
  return {
    settings
  };
};
