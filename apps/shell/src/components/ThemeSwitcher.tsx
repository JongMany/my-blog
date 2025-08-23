// export default function ThemeSwitcher() {
//   const [theme, setTheme] = React.useState(
//     document.documentElement.getAttribute("data-theme") ?? "dark"
//   );
//   useEffect(() => {
//     document.documentElement.setAttribute("data-theme", theme);
//   }, [theme]);

//   return (
//     <div className="inline-flex items-center gap-2">
//       <span className="text-xs">Theme</span>
//       <button
//         onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//         className="rounded border border-white/20 px-2 py-1 text-xs hover:bg-white/10"
//       >
//         {theme === "dark" ? "Dark" : "Light"}
//       </button>
//     </div>
//   );
// }
