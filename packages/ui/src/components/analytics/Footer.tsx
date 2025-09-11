import { GaCounters } from "./GaCounter";

export default function SiteFooter() {
  return (
    <footer className="text-sm text-[var(--muted)]">
      <GaCounters
        api={import.meta.env.VITE_GA_API_URL}
        scope="site"
        start="2024-01-01" // 사이트 오픈일로 넉넉히
        end="today"
      />
    </footer>
  );
}
