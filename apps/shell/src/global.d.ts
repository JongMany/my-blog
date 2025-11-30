declare module "blog/BlogApp" {
  const BlogApp: React.ComponentType;
  export default BlogApp;
}
declare module "portfolio/App" {
  const App: React.ComponentType;
  export default App;
}
declare module "resume/App" {
  const App: React.ComponentType;
  export default App;
}
declare module "home/App" {
  const App: React.ComponentType;
  export default App;
}
declare module "blog/*";
declare module "portfolio/*";
declare module "resume/*";
declare module "home/*";

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
