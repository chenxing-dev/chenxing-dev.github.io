<template>
  <div ref="sketchContainer"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
// import p5 from "p5";

interface SketchContainerRef {
  value: HTMLElement | null;
}

const sketchContainer: SketchContainerRef = ref(null);

onMounted((): void => {
  if (sketchContainer.value) {
    // new p5(sketch, sketchContainer.value);
  }
});

// function sketch(p: p5) {
//   p.setup = () => {
//     p.createCanvas(400, 300);
//   };
//   p.draw = () => {
//     // Interactive drawing logic
//   };
// }
</script>
