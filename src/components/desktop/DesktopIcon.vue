<script setup lang="ts">
import { computed } from "vue";
import { useSettings } from "../useSettings";
import { getIconByType } from "../../config/app";

const { settings } = useSettings();

const props = defineProps<{
  label: string;
  type: string;
}>();

const emit = defineEmits<{
  (e: "open", type: string): void;
}>();

const iconComponent = computed(() => {
  const component = getIconByType(props.type);
  if (component) {
    return component;
  }
  return null;
});
</script>

<template>
  <div class="desktop-icon group flex flex-col items-center p-2 w-16 cursor-pointer transition-all" @dblclick="emit('open', type)">
    <div class="icon-container mb-1 w-12 h-12 flex items-center justify-center rounded-lg group-hover:scale-[1.2] transition-all duration-300">
      <component :is="iconComponent" v-if="iconComponent" class="text-6xl bg-transparent" />
    </div>
    <span class="text-sm text-zinc-500 px-1 py-0.5 rounded transition-colors text-center text-shadow-lg text-secondary" :class="settings.background + settings.theme">
      {{ label }}
    </span>
  </div>
</template>
<style scoped></style>
