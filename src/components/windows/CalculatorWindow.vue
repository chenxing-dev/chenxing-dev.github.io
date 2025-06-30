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
        class="calc-btn h-8 text-xl bg-zinc-50/50 border border-secondary transition-all duration-200 font-medium flex items-center justify-center cursor-pointer select-none hover:bg-zinc-200/50"
        :class="{
          operator: ['+', '-', '×', '÷'].includes(btn),
          number: !isNaN(Number(btn)) || btn === '.',
          function: ['C', 'CE', '⌫', '+/-', '%'].includes(btn),
          equals: btn === '='
        }"
        @click="handleButtonClick(btn)"
      >
        {{ btn }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Decimal from "decimal.js";

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
const handleButtonClick = (value: string) => {
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

const formatResult = (result: Decimal) => {
  const num = result.toNumber();

  // Handle repeating decimals
  if (result.isInteger() === false) {
    // Truncate the decimal part if too long
    const str = result.toString();
    if (str.includes(".") && str.length > 15) {
      const [intPart, decPart] = str.split(".");
      return `${intPart}.${decPart.substring(0, 15)}`;
    }
  }
  // Handle large numbers
  if (Math.abs(num) > 1e16 || Math.abs(num) < 1e-15) {
    return num
      .toExponential(10)
      .replace(/(\.\d*?)0+e/, "$1e")
      .replace(/\.e/, "e");
  }

  return result.toString();
};

// Calculate result
const calculateResult = () => {
  if (operator.value === null || shouldResetDisplay.value) {
    return;
  }

  const prev = new Decimal(previousValue.value ?? 0);
  const current = new Decimal(currentValue.value);
  let result: Decimal;

  switch (operator.value) {
    case "+":
      result = prev.plus(current);
      break;
    case "-":
      result = prev.minus(current);
      break;
    case "×":
      result = prev.times(current);
      break;
    case "÷":
      result = prev.dividedBy(current);
      break;
    default:
      return;
  }

  // Format result and update display
  currentValue.value = formatResult(result);
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
