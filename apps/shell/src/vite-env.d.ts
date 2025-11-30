/// <reference types="vite/client" />

type GtagEventParams = Record<string, string | number | boolean | undefined>;

interface GtagFunction {
  (command: "js", date: Date): void;
  (command: "config", targetId: string, params?: GtagEventParams): void;
  (command: "event", eventName: string, params?: GtagEventParams): void;
}

declare global {
  interface Window {
    gtag?: GtagFunction;
  }
}

export {};
