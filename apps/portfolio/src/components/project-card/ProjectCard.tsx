import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import * as React from "react";
import type { ProjectMeta } from "../../service/portfolio";
import {
  getThumbnailPath,
  getThumbnailAspectRatio,
  getFallbackThumbnail,
} from "../../service/portfolio";
import { imageSource } from "@mfe/shared";

// 호버 애니메이션만 (인뷰 애니메이션은 ProjectGrid에서 처리)
const hoverAnim = {
  whileHover: { y: -4, scale: 1.01 },
  transition: { type: "spring", stiffness: 260, damping: 18 },
} as const;

type Props = {
  p: ProjectMeta;
  maxTags?: number; // 태그 보여줄 최대 개수
  showImage?: boolean;
};

export default function ProjectCard({
  p,
  maxTags = 3,
  showImage = true,
}: Props) {
  const tags = p.tags ?? [];
  const visible = tags.slice(0, maxTags);
  const more = tags.length - visible.length;

  const [imgOk, setImgOk] = React.useState(true);
  const [currentSrc, setCurrentSrc] = React.useState<string>("");

  // 썸네일 경로 처리
  React.useEffect(() => {
    if (p.cover) {
      // 원본 cover 경로를 그대로 사용 (imageSource에서 처리)
      setCurrentSrc(p.cover);
    }
  }, [p.cover]);

  const handleImageError = () => {
    if (currentSrc !== getFallbackThumbnail()) {
      setCurrentSrc(getFallbackThumbnail());
    } else {
      setImgOk(false);
    }
  };

  return (
    <li className="h-full">
      <Link
        to={`/portfolio/project/${p.slug}`}
        className="group block h-full focus-visible:outline-none focus-visible:[box-shadow:var(--ring)]"
        aria-label={`${p.title} 상세 보기`}
      >
        <motion.article
          {...hoverAnim}
          className="t-card h-full overflow-hidden"
        >
          {/* 썸네일 (있을 때만) */}
          {showImage && p.cover && imgOk && currentSrc && (
            <div
              className={`relative ${getThumbnailAspectRatio(p.coverAspectRatio)} overflow-hidden`}
            >
              <img
                src={`${imageSource(currentSrc, "portfolio", {
                  isDevelopment: import.meta.env.MODE === "development",
                })}`}
                alt={p.coverAlt || p.title}
                loading="lazy"
                decoding="async"
                onError={handleImageError}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              {/* 우상단 메타 칩 */}
              {p.project && (
                <span className="absolute right-2 top-2 t-chip text-[10px]">
                  {p.project}
                </span>
              )}
              {/* 호버 그라데이션 */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.06) 40%, rgba(0,0,0,.12))",
                }}
              />
            </div>
          )}

          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-medium leading-tight">{p.title}</h3>
              {/* 썸네일이 없을 땐 텍스트 메타로 노출 */}
              {!p.cover && p.project && (
                <div className="text-xs text-[var(--muted-fg)]">
                  {p.project}
                </div>
              )}
            </div>

            {p.summary && (
              <p className="mt-2 text-sm leading-5 line-clamp-2 min-h-[2.5rem]">
                {p.summary}
              </p>
            )}

            {!!tags.length && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {visible.map((t: string) => (
                  <span key={t} className="t-chip">
                    #{t}
                  </span>
                ))}
                {more > 0 && <span className="t-chip text-xs">+{more}</span>}
              </div>
            )}
          </div>
        </motion.article>
      </Link>
    </li>
  );
}
