<script setup lang="ts">
import { ref } from "vue";
import { useSettings } from "../useSettings";

const { settings, saveSettings } = useSettings();

// Tab management
const activeTab = ref("appearance");
const tabs = [
  { id: "appearance", label: "Appearance" },
  { id: "desktop", label: "Desktop" }
];

// Preview themes
const themes = [
  { id: "cozy", name: "Cozy", colors: ["#d4b483", "#a0b4a6", "#c6a1a8"] },
  { id: "minimal", name: "Minimal", colors: ["#8ba6ac", "#a0c1d1", "#e8e3d8"] },
  { id: "paper", name: "Paper", colors: ["#f5f0e6", "#e8d8c5", "#d4c0a1"] },
  { id: "forest", name: "Forest", colors: ["#a0b4a6", "#8ba6ac", "#6a8b9c"] }
];

// Background textures
const textures = [
  { id: "fabric", name: "Soft Fabric" },
  { id: "paper", name: "Paper Grain" },
  { id: "linen", name: "Linen Weave" },
  { id: "white", name: "White" }
];

// Reset settings to defaults
const resetSettings = () => {
  settings.value = {
    theme: "cozy",
    background: "fabric",
    iconSize: "medium",
    clockFormat: "24h",
    customCSS: ""
  };
  saveSettings();
};
</script>

<template>
  <div class="flex flex-col h-full bg-zinc-50 overflow-hidden">
    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar Navigation -->
      <div class="w-48 bg-zinc-50/80 border-r border-zinc-300">
        <div class="p-4">
          <div class="text-xs text-zinc-500 mb-2 pl-2">SETTINGS CATEGORIES</div>
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="w-full text-left p-2.5 pb-3 rounded-lg transition-all mb-1"
            :class="{
              'bg-zinc-500 text-zinc-50': activeTab === tab.id,
              'text-zinc-500 hover:bg-zinc-200': activeTab !== tab.id
            }"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="mt-auto p-4 border-t border-zinc-300">
          <button @click="resetSettings" class="w-full text-left p-2.5 rounded-lg text-zinc-500 hover:bg-zinc-100 transition-colors">Reset to Defaults</button>
        </div>
      </div>

      <!-- Settings Content -->
      <div class="flex-1 p-6 overflow-auto bg-gradient-to-br from-zinc-100 to-zinc-200">
        <!-- Appearance Settings -->
        <div v-show="activeTab === 'appearance'">
          <h3 class="text-lg font-bold text-zinc-500 mb-4">Appearance</h3>

          <div class="grid grid-cols-1 gap-6">
            <!-- Theme Selection -->
            <div class="bg-zinc-50/90 backdrop-blur-sm rounded-xl border border-zinc-300 p-4">
              <h4 class="font-medium text-zinc-500 mb-4">Theme</h4>
              <div class="grid grid-cols-2 gap-4">
                <div v-for="theme in themes" :key="theme.id" @click="settings.theme = theme.id" class="border-2 rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02]" :class="{ 'border-zinc-400': settings.theme === theme.id, 'border-transparent': settings.theme !== theme.id }">
                  <div class="font-medium text-center mb-2">{{ theme.name }}</div>
                  <div class="flex h-8 rounded-lg overflow-hidden shadow">
                    <div v-for="(color, index) in theme.colors" :key="index" class="flex-1" :style="{ backgroundColor: color }"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Background Texture -->
            <div class="bg-zinc-50/90 backdrop-blur-sm rounded-xl border border-zinc-300 p-4">
              <h4 class="font-medium text-zinc-500 mb-4">Background</h4>
              <div class="grid grid-cols-4 gap-4">
                <div v-for="texture in textures" :key="texture.id" @click="settings.background = texture.id" class="border-2 rounded-lg p-4 cursor-pointer transition-all hover:scale-[1.02] flex flex-col h-full" :class="{ 'border-zinc-400': settings.background === texture.id, 'border-transparent': settings.background !== texture.id }">
                  <!-- Fixed height text container with centered content -->
                  <div class="text-zinc-600 text-center mb-2 h-8 flex items-center justify-center">
                    <span class="leading-tight text-sm">{{ texture.name }}</span>
                  </div>
                  <div
                    class="h-16 rounded-md overflow-hidden relative shadow"
                    :class="{
                      'bg-[#e8e3d8]': texture.id === 'fabric',
                      'bg-[#f5f0e6]': texture.id === 'paper',
                      'bg-[#d8e3f0]': texture.id === 'linen',
                      'bg-white': texture.id === 'white'
                    }"
                  >
                    <!-- Fabric texture -->
                    <div v-if="texture.id === 'fabric'" class="absolute inset-0 opacity-20 bg-[url('/textures/fabric.png')]"></div>

                    <!-- Paper texture -->
                    <div v-if="texture.id === 'paper'" class="absolute inset-0 opacity-10 bg-[url('/textures/paper.png')]"></div>

                    <!-- Linen texture -->
                    <div v-if="texture.id === 'linen'" class="absolute inset-0 opacity-15 bg-[url('/textures/linen.png')]"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Icon Size -->
            <div class="bg-zinc-50/90 backdrop-blur-sm rounded-xl border border-zinc-300 p-4">
              <h4 class="font-medium text-zinc-500 mb-4">Icon Size</h4>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-zinc-500">Small</span>
                <span class="text-sm text-zinc-500">Large</span>
              </div>
              <div class="relative pt-1">
                <input type="range" min="1" max="3" v-model="settings.iconSize" class="w-full h-2 bg-zinc-300 rounded-lg appearance-none cursor-pointer accent-zinc-500" />
                <div class="flex justify-between text-xs px-1 mt-1">
                  <span :class="{ 'font-bold text-zinc-500': settings.iconSize === 'small' }">S</span>
                  <span :class="{ 'font-bold text-zinc-500': settings.iconSize === 'medium' }">M</span>
                  <span :class="{ 'font-bold text-zinc-500': settings.iconSize === 'large' }">L</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop Settings -->
        <div v-show="activeTab === 'desktop'">
          <h3 class="text-lg font-bold text-zinc-500 mb-4">Desktop</h3>

          <div class="grid grid-cols-1 gap-6">
            <!-- Clock Format -->
            <div class="bg-zinc-50/90 backdrop-blur-sm rounded-xl border border-zinc-300 p-4">
              <h4 class="font-medium text-zinc-500 mb-4">Clock Format</h4>
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

            <!-- Custom CSS -->
            <div class="bg-zinc-50/90 rounded-xl border border-zinc-300 p-4 md:col-span-2">
              <h4 class="font-medium text-zinc-600 mb-4">Custom CSS</h4>
              <textarea v-model="settings.customCSS" class="w-full h-32 p-3 text-sm font-mono rounded-lg border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-500" placeholder="Add your custom CSS here..."></textarea>
              <div class="text-xs text-zinc-500 mt-2">Use custom CSS to personalize your OS appearance</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Bar -->
    <div class="flex items-center justify-between px-3 py-1 text-xs text-gray-500 bg-zinc-50/90 border-t border-zinc-300">
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
</style>
