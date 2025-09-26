import { useStorage } from "@vueuse/core";

import type { Settings } from "@/types";

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
