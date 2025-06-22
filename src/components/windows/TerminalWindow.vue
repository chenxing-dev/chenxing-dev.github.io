<template>
  <div class="terminal whitespace-pre overflow-auto h-full">
    <div v-for="(line, index) in output" :key="index" class="terminal-line">
      <p v-if="line.type === 'command'" class="flex">
        <span class="terminal-prompt mr-2">user@陈刑OS:~$</span>
        <span>{{ line.text }}</span>
      </p>
      <p v-else class="terminal-output">{{ line.text }}</p>
    </div>
    <p class="terminal-line flex">
      <span class="terminal-prompt mr-2">user@陈刑OS:~$</span>
      <input v-model="command" @keyup.enter="executeCommand" class="terminal-input bg-transparent outline-none flex-1"
        ref="input" />
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const command = ref('')
const output = ref<{ type: string, text: string }[]>([
  { type: 'output', text: 'Welcome to 陈刑OS Terminal!' },
  { type: 'output', text: 'Type "help" for available commands' }
])

const commands: { [key: string]: (args?: string[]) => string } = {
  help: () => `Available commands: ${Object.keys(commands).join(", ")}`,
  neofetch: () =>
    `user@陈刑OS 
-------------------- 
OS: 陈刑OS  v1.0 
Shell: vue-sh 
Theme: Cozy Minimalism`,
  clear: () => {
    output.value = []
    return ''
  },
  about: () => '陈刑OS  is a personal desktop environment website built with Vue.js',
};

const executeCommand = () => {
  if (!command.value.trim()) return

  output.value.push({ type: 'command', text: command.value })

  const cmd = command.value.split(' ')[0]
  const args = command.value.split(' ').slice(1)

  if (commands[cmd]) {
    const result = commands[cmd](args)
    if (result) {
      output.value.push({ type: 'output', text: result })
    }
  } else {
    output.value.push({ type: 'output', text: `Command not found: ${cmd}` })
  }

  command.value = ''
};
</script>
