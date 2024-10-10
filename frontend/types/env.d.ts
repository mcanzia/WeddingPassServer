// src/env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SERVER_API_URL: string;
    readonly VITE_FRONTEND_PORT: number;
    readonly VITE_FIREBASE_CONFIG: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  