<script lang="ts" setup>
import { ref, watch, nextTick, computed } from "vue";

// Define the output line type
type TerminalOutputLine = { type: "command"; text: string; cwd: string } | { type: "output"; text: string } | { type: "file-list"; items: FileSystemItem[] };
type FileSystemItem = {
  name: string;
  type: "file" | "dir";
  content?: string;
  children?: FileSystemItem[];
};

const command = ref("");
const output = ref<TerminalOutputLine[]>([
  { type: "output", text: "Welcome to 陈刑OS Terminal!" },
  { type: "output", text: 'Type "help" for available commands' }
]);
const terminalBody = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

// Current working directory as path segments
const currentPath = ref<string[]>([]);
const currentDir = computed(() => {
  return currentPath.value.length > 0 ? `~/${currentPath.value.join("/")}` : "~";
});
const prompt = (dir: string) => computed(() => `[${dir}] $`);

// Virtual file system
const fileSystem = ref<FileSystemItem>({
  name: "~",
  type: "dir",
  children: [
    { name: "about.txt", type: "file", content: "陈刑OS is a personal desktop environment built with Vue.js" },
    { name: "contact.txt", type: "file", content: "微博: @陈刑很刑" },
    {
      name: "projects",
      type: "dir",
      children: [{ name: "game-dev", type: "dir", children: [] }]
    },
    { name: "documents", type: "dir", children: [{ name: "ideas.md", type: "file", content: "# Future Features\n\n- Notepad application\n- Calculator" }] },
    { name: "readme.md", type: "file", content: "# Welcome to 陈刑OS\nThis is a personal desktop environment with a cozy minimalist theme." }
  ]
});

// Helper to get current directory contents
const getCurrentDirContents = (): FileSystemItem[] => {
  let current = fileSystem.value.children!;

  // Traverse through the current path segments
  for (const segment of currentPath.value) {
    const dir = current.find(item => item.name === segment && item.type === "dir" && item.children);

    if (dir && dir.children) {
      current = dir.children;
    } else {
      return []; // Path doesn't exist
    }
  }

  return current;
};

const scrollToBottom = () => {
  nextTick(() => {
    if (terminalBody.value) {
      terminalBody.value.scrollTop = terminalBody.value.scrollHeight;
    }
  });
};

// Scroll to bottom when output changes
watch(
  output,
  () => {
    scrollToBottom();
  },
  { deep: true }
);

watch([terminalBody, inputRef], () => {
  inputRef.value?.focus();
});

// Define the command function type
type CommandFunction = (args?: string[]) => TerminalOutputLine[] | void;

// Implement commands
const commands: Record<string, CommandFunction> = {
  help: () => {
    return [{ type: "output", text: "Available commands: " + Object.keys(commands).join(", ") }];
  },
  neofetch: () => {
    return [
      { type: "output", text: "user@chenxing-dev.github.io" },
      { type: "output", text: "----------------" },
      { type: "output", text: "OS: 陈刑OS v1.0" },
      { type: "output", text: "Host: chenxing-dev.github.io" },
      { type: "output", text: "Shell: vue-sh 3.5.13" },
      { type: "output", text: "Theme: Cozy Minimalism" }
    ];
  },
  clear: () => {
    output.value = [];
  },
  about: () => {
    return [{ type: "output", text: "陈刑OS is a personal desktop environment built with Vue.js" }];
  },
  date: () => [{ type: "output", text: new Date().toLocaleString() }],
  echo: (args?: string[]) => {
    return [{ type: "output", text: args ? args.join(" ") : "" }];
  },
  // ls command implementation
  ls: () => {
    const contents = getCurrentDirContents();
    return [{ type: "file-list", items: contents }];
  },
  // cat command implementation
  cat: (args?: string[]) => {
    if (!args || args.length === 0) {
      return [{ type: "output", text: "cat: missing file operand" }];
    }

    const filename = args[0];
    const contents = getCurrentDirContents();
    const file = contents.find(item => item.name === filename && item.type === "file");

    if (file && file.content) {
      return [{ type: "output", text: file.content }];
    }

    return [{ type: "output", text: `cat: ${filename}: No such file or directory` }];
  },
  // cd command for directory navigation
  cd: (args?: string[]) => {
    if (!args || args.length === 0) {
      // cd without arguments goes nowhere
      return [];
    }

    const target = args[0];

    if (target === "..") {
      // Go up one directory (only if not already at root)
      if (currentPath.value.length > 0) {
        currentPath.value = currentPath.value.slice(0, -1);
      }
      return [];
    }

    // Check if directory exists
    const contents = getCurrentDirContents();
    const dirExists = contents.some(item => item.name === target && item.type === "dir");

    if (dirExists) {
      // Enter the directory
      currentPath.value = [...currentPath.value, target];
      return [];
    }

    return [{ type: "output", text: `cd: ${target}: No such directory` }];
  },
  // pwd command to show current directory
  pwd: () => {
    return [{ type: "output", text: currentDir.value }];
  }
};

const executeCommand = () => {
  if (!command.value.trim()) return;

  // Capture current directory before executing command
  const cwdAtExecution = currentDir.value;

  // Add the command to output with the current directory at execution time
  output.value.push({ type: "command", text: command.value, cwd: cwdAtExecution });

  const [cmd, ...args] = command.value.split(" ");

  if (commands[cmd]) {
    const result = commands[cmd](args);
    if (result) {
      output.value.push(...result);
    }
  } else {
    output.value.push({ type: "output", text: `Command not found: ${cmd}.` });
    output.value.push({ type: "output", text: 'Type "help" for commands.' });
  }

  command.value = "";
  scrollToBottom();
};
</script>

<template>
  <div class="terminal whitespace-pre overflow-auto h-full text-wrap break-all py-2 px-4" ref="terminalBody">
    <div v-for="(line, index) in output" :key="index" class="terminal-line">
      <p v-if="line.type === 'command'" class="inline text-nowrap">
        <span class="terminal-prompt mr-2">{{ prompt(line.cwd) }}</span>
        <span class="text-wrap">{{ line.text }}</span>
      </p>
      <span v-else-if="line.type === 'file-list'" class="terminal-file-list grid grid-cols-4">
        <div v-for="(item, idx) in line.items" :key="idx" class="flex items-center">
          <span v-if="item.type === 'dir'" class="text-blue-400 mr-1">📁</span>
          <span v-else class="text-yellow-300 mr-1">📄</span>
          <span>{{ item.name }}</span>
        </div>
      </span>
      <p v-else class="terminal-output">{{ line.text }}</p>
    </div>
    <p class="terminal-line flex">
      <span class="terminal-prompt mr-2">{{ prompt(currentDir) }}</span>
      <input class="terminal-input bg-transparent outline-none flex-1" v-model="command" @keyup.enter="executeCommand" ref="inputRef" autofocus />
    </p>
  </div>
</template>
<style scoped>
.terminal {
  scrollbar-color: #71717a #e4e4e7;
  scrollbar-width: thin;
}
</style>
