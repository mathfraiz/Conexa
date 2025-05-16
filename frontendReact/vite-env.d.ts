/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  // você pode adicionar outras se quiser
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
