/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vite/client" />

interface Window {
  umami?: {
    track: (k?: string | any, p?: any) => void;
    identify: (p: any) => void;
  };
}
