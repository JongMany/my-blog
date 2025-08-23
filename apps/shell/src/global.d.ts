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

declare module "blog/*";
declare module "portfolio/*";
declare module "resume/*";
