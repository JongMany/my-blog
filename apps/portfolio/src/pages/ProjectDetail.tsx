import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { projects, type ImageItem } from "../service/portfolio";

export default function ProjectDetail() {
  const { slug = "" } = useParams();
  const p = projects.find((x) => x.slug === slug);

  const images: ImageItem[] = useMemo(() => {
    if (!p) return [];
    const arr = [...(p.images ?? [])];
    // thumb가 있고 images에 없으면 맨 앞에 넣기
    if (p.thumb && !arr.some((i) => i.src === p.thumb)) {
      arr.unshift({ src: p.thumb, caption: "대표 이미지" });
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

function ImageGrid({ images }: { images: ImageItem[] }) {
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
      {/* 썸네일 그리드 */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((img, i) => (
          <button
            key={img.src}
            onClick={() => openAt(i)}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] shadow-sm transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            <img
              src={`/my-blog/portfolio/${img.src}`}
              alt={img.alt || img.caption || ""}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover"
            />
            {/* 캡션 미리보기 (있을 때만) */}
            {img.caption && (
              <span className="pointer-events-none absolute inset-x-0 bottom-0 line-clamp-1 bg-gradient-to-t from-black/60 to-transparent px-2 py-1 text-[11px] text-white opacity-0 transition group-hover:opacity-100">
                {img.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 라이트박스: 이미지(좌) + 설명(우) */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="fixed inset-0 z-[95] grid place-items-center p-4">
            {/* md 이상에서 2열, 우측 패널은 고정폭(22rem) */}
            <section className="relative grid w-full max-w-6xl overflow-hidden rounded-2xl border border-white/15 bg-[var(--card-bg)] shadow-2xl md:[grid-template-columns:minmax(0,1fr)_22rem]">
              {/* 좌: 이미지 영역 */}
              <figure className="relative max-h-[90vh]">
                <img
                  key={images[idx].src}
                  src={`/my-blog/portfolio/${images[idx].src}`}
                  alt={images[idx].alt || images[idx].caption || ""}
                  className="max-h-[90vh] w-full object-contain bg-black/20"
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
                {/* 닫기 */}
                <button
                  className="absolute right-3 top-3 rounded-lg bg-black/50 px-2 py-1 text-sm text-white hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  닫기
                </button>
              </figure>

              {/* 우: 설명 패널 (모바일에서는 아래로 스택) */}
              <aside className="max-h-[90vh] overflow-auto border-t border-white/10 p-4 md:border-l md:border-t-0">
                <div className="mb-2 text-xs text-white/60">
                  {idx + 1} / {images.length}
                </div>

                {/* caption */}
                {images[idx].caption && (
                  <h3 className="text-base font-medium">
                    {images[idx].caption}
                  </h3>
                )}

                {/* note (긴 설명) */}
                {images[idx].note && (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--muted-fg)]">
                    {images[idx].note}
                  </p>
                )}

                {/* 원본 열기 / 새탭 */}
                <div className="mt-4 flex items-center gap-2">
                  <a
                    href={images[idx].src}
                    target="_blank"
                    rel="noreferrer"
                    className="t-btn t-btn--primary text-xs"
                  >
                    원본 보기
                  </a>
                </div>

                {/* 썸네일 미니 리스트(선택) */}
                {images.length > 1 && (
                  <div className="mt-4 grid grid-cols-4 gap-2 md:grid-cols-3">
                    {images.map((img, i) => (
                      <button
                        key={img.src}
                        onClick={() => setIdx(i)}
                        className={`overflow-hidden rounded-md border ${
                          i === idx
                            ? "border-[var(--primary)]"
                            : "border-white/10 hover:border-white/20"
                        }`}
                        aria-label={`Go to image ${i + 1}`}
                      >
                        <img
                          src={`/my-blog/portfolio/${img.src}`}
                          alt={img.alt || img.caption || ""}
                          loading="lazy"
                          decoding="async"
                          className="aspect-[4/3] w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </aside>
            </section>
          </div>
        </>
      )}
    </>
  );
}
