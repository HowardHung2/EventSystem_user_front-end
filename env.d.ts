/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly ROOT_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
