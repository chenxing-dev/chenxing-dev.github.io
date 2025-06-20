<template>
  <div class="terminal">
    <div ref="output"></div>
    <div class="input-line">
      <span class="prompt">user@tissuepack:~$ </span>
      <input v-model="command" @keyup.enter="executeCommand" ref="input" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const commands: { [key: string]: (args?: string[]) => string } = {
  help: () => `Available commands: ${Object.keys(commands).join(", ")}`,
  neofetch: () => `
    user@tissuepack 
    -------------------- 
    OS: TissuePackOS v1.0 
    Shell: vue-sh 
    Theme: Cozy Minimalism`
  // ... other commands
};

const output = ref('Welcome to TissuePack Terminal!\nType "help" for commands\n');
const command = ref("");

const executeCommand = () => {
  const [cmd, ...args] = command.value.split(" ");
  output.value += `\n$ ${command.value}\n`;

  if (commands[cmd]) {
    output.value += commands[cmd](args) + "\n";
  } else {
    output.value += `Command not found: ${cmd}\n`;
  }

  command.value = "";
};
</script>
