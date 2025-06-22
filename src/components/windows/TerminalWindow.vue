<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue'

// Define the output line type
type TerminalOutputLine =
  | { type: 'command', text: string }
  | { type: 'output', text: string }

const command = ref('')

// Define the command function type
type CommandFunction = (args?: string[]) => TerminalOutputLine[] | void;

const commands: Record<string, CommandFunction> = {
  help: () => {
    return [
      { type: 'output', text: 'Available commands: ' + Object.keys(commands).join(', ') }
    ]
  },
  neofetch: () => {
    return [
      { type: 'output', text: 'user@chenxing-dev.github.io' },
      { type: 'output', text: '----------------' },
      { type: 'output', text: 'OS: 陈刑OS v1.0' },
      { type: 'output', text: 'Host: chenxing-dev.github.io' },
      { type: 'output', text: 'Shell: vue-sh 3.5.13' },
      { type: 'output', text: 'Theme: Cozy Minimalism' }
    ]
  },
  clear: () => {
    output.value = []
  },
  about: () => {
    return [
      { type: 'output', text: '陈刑OS is a personal desktop environment built with Vue.js' }
    ]
  },
  date: () => [{ type: 'output', text: new Date().toLocaleString() }],
  echo: (args?: string[]) => [{ type: 'output', text: args?.join(' ') ?? '' }]
};

const output = ref<TerminalOutputLine[]>([
  { type: 'output', text: 'Welcome to 陈刑OS Terminal!' },
  { type: 'output', text: 'Type "help" for available commands' }
])

const terminalBody = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (terminalBody.value) {
      terminalBody.value.scrollTop = terminalBody.value.scrollHeight
    }
  })
}

// Scroll to bottom when output changes
watch(output, () => {
  scrollToBottom()
}, { deep: true })

watch(inputRef, () => {
  inputRef.value?.focus()
})

const executeCommand = () => {
  if (!command.value.trim()) return

  output.value.push({ type: 'command', text: command.value })

  const [cmd, ...args] = command.value.split(' ')

  if (commands[cmd]) {
    const result = commands[cmd](args)
    if (result) {
      output.value.push(...result)
    }
  } else {
    output.value.push({ type: 'output', text: `Command not found: ${cmd}.` })
    output.value.push({ type: 'output', text: 'Type "help" for commands.' })
  }

  command.value = ''
  scrollToBottom()
};
</script>


<template>
  <div class="terminal whitespace-pre overflow-auto h-full text-wrap break-all" ref="terminalBody">
    <div v-for="(line, index) in output" :key="index" class="terminal-line">
      <p v-if="line.type === 'command'" class="inline text-nowrap">
        <span class="terminal-prompt mr-2">user@陈刑OS:~$</span>
        <span class="text-wrap">{{ line.text }}</span>
      </p>
      <p v-else class="terminal-output">{{ line.text }}</p>
    </div>
    <p class="terminal-line flex">
      <span class="terminal-prompt mr-2">user@陈刑OS:~$</span>
      <input class="terminal-input bg-transparent outline-none flex-1" v-model="command" @keyup.enter="executeCommand"
        ref="inputRef" autofocus />
    </p>
  </div>
</template>
