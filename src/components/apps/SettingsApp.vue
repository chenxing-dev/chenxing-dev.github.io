<script setup lang="ts">
import { ref } from "vue";

import { defaultSettings, useSettings } from "@/composables/useSettings";

const { settings } = useSettings();

// Tab management
const activeTab = ref("appearance");
const tabs = [
  { id: "appearance", label: "Appearance" },
  { id: "desktop", label: "Desktop" }
];

// Preview themes
const themes = [
  { id: "theme-cozy", name: "Cozy", colors: ["#f1e9d6", "#645a46", "#c2a37a"] },
  { id: "theme-minimal", name: "Minimal", colors: ["#18181b", "#fafafa", "#a1a1aa"] },
  { id: "theme-paper", name: "Paper", colors: ["#4e4e4e", "#f6f2ec", "#9c9b96"] },
  { id: "theme-pastel", name: "Pastel", colors: ["#f3d7d1", "#f7ede3", "#f58583"] }
];

// Background
const backgrounds = [
  { id: "bg-sand", name: "Sand", class: "bg-[#f4deb9]" },
  { id: "bg-paper", name: "Grid Paper", class: "bg-[#eee9d6]" },
  { id: "bg-sky-blue", name: "Sky Blue", class: "bg-[#92c1d3]" },
  { id: "bg-off-white", name: "Off-White", class: "bg-zinc-50" }
];

// Reset settings to defaults
const resetSettings = () => {
  Object.assign(settings, defaultSettings);
};
</script>

<template>
  <div class="flex flex-col h-full bg-zinc-50 overflow-hidden">
    <!-- Mobile Header with Dropdown -->
    <div class="md:hidden border-b border-zinc-300 p-4 bg-white">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-zinc-700">Settings</h2>
        <select v-model="activeTab"
          class="bg-white border border-zinc-300 rounded-lg px-3 py-2 text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-500">
          <option v-for="tab in tabs" :key="tab.id" :value="tab.id">
            {{ tab.label }}
          </option>
        </select>
      </div>
    </div>
    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar Navigation (Hidden on mobile) -->
      <div class="hidden md:flex flex-col md:w-48 bg-zinc-50/80 border-r border-zinc-300">
        <div class="p-4">
          <div class="text-xs text-zinc-500 mb-2 pl-2">SETTINGS CATEGORIES</div>
          <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
            class="w-full text-left p-2.5 pb-3 rounded-lg transition-all mb-1" :class="{
              'bg-zinc-500 text-zinc-50': activeTab === tab.id,
              'text-zinc-500 hover:bg-zinc-200': activeTab !== tab.id
            }">
            {{ tab.label }}
          </button>
        </div>

        <div class="mt-auto p-4 border-t border-zinc-300">
          <button @click="resetSettings"
            class="w-full text-left p-2.5 rounded-lg text-zinc-500 hover:bg-zinc-100 transition-colors">Reset to
            Defaults</button>
        </div>
      </div>

      <!-- Settings Content -->
      <div class="flex-1 px-4 py-2 md:p-6 overflow-auto bg-gradient-to-br from-zinc-100 to-zinc-200 tab-content">
        <!-- Appearance Settings -->
        <div v-show="activeTab === 'appearance'">
          <h3 class="text-lg font-bold text-zinc-500 mb-4">Appearance</h3>

          <div class="grid grid-cols-1 gap-6">
            <!-- Theme Selection -->
            <div class="bg-zinc-50/90 backdrop-blur-sm rounded-xl border border-zinc-300 p-4">
              <h4 class="font-medium text-zinc-600 mb-4">Theme</h4>
              <div class="grid grid-cols-2 gap-2 md:gap-4">
                <div v-for="theme in themes" :key="theme.id" @click="settings.theme = theme.id"
                  class="border-2 rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] text-zinc-600"
                  :class="{ 'border-zinc-400': settings.theme === theme.id, 'border-transparent': settings.theme !== theme.id }">
                  <div class="font-medium text-center mb-2">{{ theme.name }}</div>
                  <div class="flex h-8 rounded-lg overflow-hidden shadow">
                    <div v-for="(color, index) in theme.colors" :key="index" class="flex-1"
                      :style="{ backgroundColor: color }"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Background -->
            <div class="bg-zinc-50/90 backdrop-blur-sm rounded-xl border border-zinc-300 p-4">
              <h4 class="font-medium text-zinc-600 mb-4">Background</h4>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div v-for="background in backgrounds" :key="background.id" @click="settings.background = background.id"
                  class="border-2 rounded-lg px-4 pb-4 md:p-4 cursor-pointer transition-all hover:scale-[1.02] flex flex-col h-full"
                  :class="{ 'border-zinc-400': settings.background === background.id, 'border-transparent': settings.background !== background.id }">
                  <!-- Fixed height text container with centered content -->
                  <div class="text-zinc-600 text-center mb-2 h-8 flex items-center justify-center">
                    <span class="leading-tight text-sm">{{ background.name }}</span>
                  </div>
                  <div class="h-14 rounded-md overflow-hidden relative shadow" :class="background.class"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop Settings -->
        <div v-show="activeTab === 'desktop'">
          <h3 class="text-lg font-bold text-zinc-500 mb-4">Desktop</h3>

          <div class="grid grid-cols-1 gap-4">
            <!-- Clock Format -->
            <div class="bg-zinc-50/90 rounded-xl border border-zinc-300 p-4">
              <h4 class="font-medium text-zinc-600 mb-4">Clock Format</h4>
              <div class="space-y-3">
                <label class="flex items-center cursor-pointer">
                  <input type="radio" v-model="settings.clockFormat" value="24h" class="mr-3 accent-zinc-500" />
                  <span class="text-zinc-500">24-hour format (14:30)</span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input type="radio" v-model="settings.clockFormat" value="12h" class="mr-3 accent-zinc-500" />
                  <span class="text-zinc-500">12-hour format (2:30 PM)</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Bar -->
    <div
      class="flex items-center justify-between px-3 py-1 text-xs text-gray-500 bg-zinc-50/90 border-t border-zinc-300">
      <div>Settings v1.0</div>
      <div>Changes saved automatically</div>
    </div>
  </div>
</template>

<style scoped>
input[type="range"] {
  appearance: none;
  -webkit-appearance: none;
  height: 6px;
  border-radius: 5px;
  background: #d4d4d8;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #52525b;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #71717a;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tab-content {
  scrollbar-color: #71717a #e4e4e7;
  scrollbar-width: thin;
}
</style>
