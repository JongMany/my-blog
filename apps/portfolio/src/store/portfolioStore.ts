import { create } from "zustand";

export type Project = {
  slug: string;
  title: string;
  summary?: string;
  project?: string;
  date?: string; // YYYY or YYYY-MM
  pinned?: boolean;
  tags: string[];
  thumb?: string;
  images?: string[];
  body?: string[]; // 문단 배열
  links?: { label: string; href: string }[];
};

type State = {
  items: Project[];
  upsert: (p: Project, opts?: { prevSlug?: string }) => void;
  remove: (slug: string) => void;
  getBySlug: (slug: string) => Project | undefined;
};

const STORAGE_KEY = "portfolio.items.v1";

function load(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Project[]) : [];
  } catch {
    return [];
  }
}
function save(items: Project[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export const usePortfolioStore = create<State>((set, get) => ({
  items: load(),
  upsert: (p, opts) => {
    const prev = get().items;
    const key = (opts?.prevSlug ?? p.slug).trim();
    const idx = prev.findIndex((x) => x.slug === key);
    let next: Project[];
    if (idx >= 0) {
      next = [...prev];
      next[idx] = { ...p };
    } else {
      next = [p, ...prev];
    }
    set({ items: next });
    save(next);
  },
  remove: (slug) => {
    const next = get().items.filter((x) => x.slug !== slug);
    set({ items: next });
    save(next);
  },
  getBySlug: (slug) => get().items.find((x) => x.slug === slug),
}));
