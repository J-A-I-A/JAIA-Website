/// <reference types="vite/client" />

// Allow importing markdown files as raw strings
declare module '*.md?raw' {
  const content: string;
  export default content;
}

declare module '*.md' {
  const content: string;
  export default content;
}

