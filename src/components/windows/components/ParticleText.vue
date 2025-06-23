<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  text: {
    type: String,
    default: "Party"
  },
  colorPalette: {
    type: Array<string>,
    default: () => [
      "#881337", // Rose 900
      "#be123c", // Rose 700
      "#a1a1aa", // Zinc 400
      "#71717a", // Zinc 500
      "#52525b", // Zinc 600
      "#9ca3af" // Gray 400
    ]
  },
  fontSize: {
    type: String,
    default: 48 // Default font size in pixels
  }
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
const animationFrame = ref<number | null>(null);
const particles = ref<any[]>([]);
const mouse = ref({ x: 0, y: 0, radius: 100 });

class Particle {
  x: number;
  y: number;
  size: number;
  baseX: number;
  baseY: number;
  density: number;
  color: string;

  constructor(x: number, y: number, palette: string[]) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 1;
    this.baseX = x;
    this.baseY = y;
    this.density = Math.random() * 30 + 1;
    // Select a random color from the soft palette
    this.color = palette[Math.floor(Math.random() * palette.length)];
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update() {
    const dx = mouse.value.x - this.x;
    const dy = mouse.value.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const forceDirectionX = dx / distance;
    const forceDirectionY = dy / distance;
    const maxDistance = mouse.value.radius;
    const force = (maxDistance - distance) / maxDistance;
    const directionX = forceDirectionX * force * this.density * 0.6;
    const directionY = forceDirectionY * force * this.density * 0.6;

    if (distance < mouse.value.radius) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        const dx = this.x - this.baseX;
        this.x -= dx / 10;
      }
      if (this.y !== this.baseY) {
        const dy = this.y - this.baseY;
        this.y -= dy / 10;
      }
    }
  }
}

const initCanvas = () => {
  if (!canvasRef.value) return;

  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  // Create text with dynamic font size
  ctx.font = `bold ${props.fontSize}px 'Noto Serif SC'`;
  ctx.textAlign = "center";
  ctx.fillText(props.text, canvas.width / 2, canvas.height / 2);

  // Get text data
  const textData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  particles.value = [];

  // Create particles
  for (let y = 0; y < canvas.height; y += 3) {
    for (let x = 0; x < canvas.width; x += 3) {
      const index = (y * canvas.width + x) * 4;
      if (textData.data[index + 3] > 128) {
        particles.value.push(new Particle(x, y, props.colorPalette));
      }
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const animate = () => {
  if (!canvasRef.value) return;

  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.value.forEach(particle => {
    particle.update();
    particle.draw(ctx);
  });

  animationFrame.value = requestAnimationFrame(animate);
};

const handleMouseMove = (e: MouseEvent) => {
  if (!canvasRef.value) return;

  const rect = canvasRef.value.getBoundingClientRect();
  mouse.value.x = e.clientX - rect.left;
  mouse.value.y = e.clientY - rect.top;
};

onMounted(() => {
  initCanvas();
  animate();
  if (canvasRef.value) {
    canvasRef.value.addEventListener("mousemove", handleMouseMove);
  }
});

onUnmounted(() => {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value);
  }
  if (canvasRef.value) {
    canvasRef.value.removeEventListener("mousemove", handleMouseMove);
  }
});
</script>

<template>
  <div class="particle-text-container">
    <canvas ref="canvasRef"></canvas>
    <div class="particle-text-tip">Move cursor to interact with particles</div>
  </div>
</template>

<style scoped>
.particle-text-container {
  position: relative;
  width: 100%;
  height: 100%;
  aspect-ratio: 16 / 9;
}

.particle-text-container canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.particle-text-tip {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 1rem;
  text-align: center;
  color: #71717a;
  /* zinc-500 */
  font-size: 0.875rem;
  /* text-sm */
}
</style>
