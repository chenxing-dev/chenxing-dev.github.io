<template>
  <div class="bg-zinc-200/50 p-4 font-mono h-full">
    <!-- Display Area -->
    <div class="display px-2 py-1 text-right border-x-12 border-y-6 border-secondary bg-zinc-50/80">
      <div class="text-zinc-400 text-sm min-h-[20px] overflow-x-hidden whitespace-nowrap">
        {{ historyDisplay }}
      </div>
      <div class="text-2xl min-h-[24px] whitespace-nowrap overflow-x-hidden">
        {{ currentDisplay }}
      </div>
    </div>

    <!-- Buttons Grid -->
    <div class="button-grid grid grid-cols-[repeat(4,_1fr)] gap-2 my-4">
      <div
        v-for="(btn, index) in buttons"
        :key="index"
        class="calc-btn h-8 text-xl bg-zinc-50/50 border border-secondary transition-all duration-200 font-medium flex items-center justify-center cursor-pointer select-none"
        :class="{
          operator: ['+', '-', '×', '÷'].includes(btn),
          number: !isNaN(Number(btn)) || btn === '.',
          function: ['C', 'CE', '⌫', '+/-', '%'].includes(btn),
          equals: btn === '='
        }"
        @click="handleButtonClick(btn, $event)"
      >
        {{ btn }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import gsap from "gsap";

// Calculator state
const currentValue = ref("0");
const previousValue = ref<string | null>(null);
const operator = ref<string | null>(null);
const shouldResetDisplay = ref(false);

// Button configuration
const buttons = ["C", "CE", "⌫", "÷", "7", "8", "9", "×", "4", "5", "6", "-", "1", "2", "3", "+", ".", "0", "+/-", "="];

// Computed display values
const currentDisplay = computed(() => {
  return currentValue.value;
});

const historyDisplay = computed(() => {
  if (previousValue.value !== null && operator.value) {
    return `${previousValue.value} ${operator.value}`;
  }
  return "";
});

// Handle button clicks
const handleButtonClick = (value: string, event: MouseEvent) => {
  // Animate button press
  gsap.to(event.target, { scale: 0.9, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.out" });

  if (!isNaN(Number(value)) || value === ".") {
    handleNumberInput(value);
  } else if (value === "C") {
    clearCalculator();
  } else if (value === "CE") {
    clearEntry();
  } else if (value === "⌫") {
    backspace();
  } else if (value === "+/-") {
    toggleSign();
  } else if (value === "%") {
    applyPercentage();
  } else if (["+", "-", "×", "÷"].includes(value)) {
    handleOperator(value);
  } else if (value === "=") {
    calculateResult();
  }
};

// Number input handler
const handleNumberInput = (digit: string) => {
  if (shouldResetDisplay.value) {
    currentValue.value = "0";
    shouldResetDisplay.value = false;
  }

  if (digit === "." && currentValue.value.includes(".")) {
    return;
  }

  if (currentValue.value === "0" && digit !== ".") {
    currentValue.value = digit;
  } else {
    currentValue.value += digit;
  }
};

// Operator handler
const handleOperator = (op: string) => {
  if (operator.value && !shouldResetDisplay.value) {
    calculateResult();
  }

  operator.value = op;
  previousValue.value = currentValue.value;
  shouldResetDisplay.value = true;
};

// Calculate result
const calculateResult = () => {
  if (operator.value === null || shouldResetDisplay.value) {
    return;
  }

  const prev = parseFloat(previousValue.value ?? "0");
  const current = parseFloat(currentValue.value);
  let result;

  switch (operator.value) {
    case "+":
      result = prev + current;
      break;
    case "-":
      result = prev - current;
      break;
    case "×":
      result = prev * current;
      break;
    case "÷":
      result = prev / current;
      break;
    default:
      return;
  }

  // Update display
  currentValue.value = result.toString();
  operator.value = null;
  previousValue.value = null;
  shouldResetDisplay.value = true;
};

// Clear calculator
const clearCalculator = () => {
  currentValue.value = "0";
  previousValue.value = null;
  operator.value = null;
  shouldResetDisplay.value = false;
};

// Clear entry
const clearEntry = () => {
  currentValue.value = "0";
};

// Backspace
const backspace = () => {
  if (currentValue.value.length === 1 || (currentValue.value.length === 2 && currentValue.value.startsWith("-"))) {
    currentValue.value = "0";
  } else {
    currentValue.value = currentValue.value.slice(0, -1);
  }
};

// Toggle sign
const toggleSign = () => {
  currentValue.value = currentValue.value.startsWith("-") ? currentValue.value.slice(1) : "-" + currentValue.value;
};

// Apply percentage
const applyPercentage = () => {
  currentValue.value = (parseFloat(currentValue.value) / 100).toString();
};
</script>
