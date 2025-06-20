<template>
  <div class="desktop-icon" @dblclick="openApp">
    <img :src="icon" class="w-12 h-12 mb-1" />
    <span class="text-xs">{{ label }}</span>
  </div>
</template>
