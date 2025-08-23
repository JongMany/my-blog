// apps/portfolio/src/pages/ProjectDetail.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { projects } from "../service/portfolio"; // 경로 주의!

export default function ProjectDetail() {
  const { slug = "" } = useParams();
  const p = projects.find((x) => x.slug === slug);

  const images = useMemo(() => {
    if (!p) return [];
    const set = new Set<string>([...(p.images ?? [])]);
    if (p.thumb) set.add(p.thumb);
    // 대표이미지는 그리드 첫번째에 오도록 정렬
    const arr = Array.from(set);
    if (p.thumb) {
      arr.sort((a, b) => (a === p.thumb ? -1 : b === p.thumb ? 1 : 0));
    }
    return arr;
  }, [p]);

  if (!p) {
    return (
      <Layout>
        <div>존재하지 않는 프로젝트입니다.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="space-y-5">
        <div className="flex flex-wrap items-start gap-3">
          <h1 className="text-2xl font-semibold">{p.title}</h1>
        </div>

        <p className="text-[var(--muted-fg)]">{p.summary}</p>

        <div className="flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span key={t} className="t-chip">
              #{t}
            </span>
          ))}
        </div>

        {p.highlights?.length ? (
          <ul className="list-disc space-y-1 pl-5">
            {p.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        ) : null}

        {/* ▼ 이미지 그리드 */}
        {images.length > 0 && <ImageGrid images={images} />}

        {p.links?.length ? (
          <div className="flex flex-wrap gap-2 pt-2">
            {p.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="t-btn t-btn--primary text-sm"
              >
                {l.label}
              </a>
            ))}
          </div>
        ) : null}
      </article>
    </Layout>
  );
}

function ImageGrid({ images }: { images: string[] }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const openAt = (i: number) => {
    setIdx(i);
    setOpen(true);
  };

  // 키보드 내비
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") setIdx((v) => (v + 1) % images.length);
      if (e.key === "ArrowLeft")
        setIdx((v) => (v - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length]);

  return (
    <>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => openAt(i)}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] shadow-sm transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover"
            />
            <span className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-gradient-to-tr from-white/0 via-white/0 to-white/10" />
          </button>
        ))}
      </div>

      {/* 라이트박스 */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="fixed inset-0 z-[95] grid place-items-center p-4">
            <figure className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-black/40 shadow-2xl">
              <img
                key={images[idx]}
                src={images[idx]}
                alt=""
                className="max-h-[90vh] w-full object-contain"
                loading="eager"
                decoding="async"
              />
              {/* Prev/Next */}
              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white shadow hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIdx((v) => (v - 1 + images.length) % images.length);
                    }}
                    aria-label="Previous"
                  >
                    ‹
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white shadow hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIdx((v) => (v + 1) % images.length);
                    }}
                    aria-label="Next"
                  >
                    ›
                  </button>
                </>
              )}
              {/* Close */}
              <button
                className="absolute right-3 top-3 rounded-lg bg-black/50 px-2 py-1 text-sm text-white hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                닫기
              </button>
            </figure>
          </div>
        </>
      )}
    </>
  );
}
