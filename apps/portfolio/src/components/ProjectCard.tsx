// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import type { Project } from "../service/portfolio";

// export default function ProjectCard({ p }: { p: Project }) {
//   return (
//     <li>
//       <Link to={`/portfolio/project/${p.slug}`} className="block h-full">
//         <motion.div
//           whileHover={{ y: -4, scale: 1.01 }}
//           transition={{ type: "spring", stiffness: 260, damping: 18 }}
//           className="t-card h-full overflow-hidden p-4"
//         >
//           <div className="flex items-start justify-between gap-2">
//             <div className="text-base font-medium">{p.title}</div>
//             {p.project && <div className="text-xs ">{p.project}</div>}
//           </div>
//           <p className="mt-2 text-sm leading-5 line-clamp-2 min-h-[2.5rem]">
//             {p.summary}
//           </p>
//           <div className="mt-3 flex flex-wrap gap-1.5">
//             {p.tags.map((t) => (
//               <span key={t} className="t-chip">
//                 #{t}
//               </span>
//             ))}
//           </div>
//         </motion.div>
//       </Link>
//     </li>
//   );
// }
// apps/portfolio/src/components/ProjectCard.tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import * as React from "react";
import type { Project } from "../service/portfolio";

type Props = {
  p: Project;
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

  // 인뷰 페이드업 + 호버 살짝 양감
  const anim = {
    initial: { opacity: 0, y: 8 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-10% 0px" },
    whileHover: { y: -4, scale: 1.01 },
    transition: { type: "spring", stiffness: 260, damping: 18 },
  } as const;

  const [imgOk, setImgOk] = React.useState(true);

  return (
    <li className="h-full">
      <Link
        to={`/portfolio/project/${p.slug}`}
        className="group block h-full focus-visible:outline-none focus-visible:[box-shadow:var(--ring)]"
        aria-label={`${p.title} 상세 보기`}
      >
        <motion.article {...anim} className="t-card h-full overflow-hidden">
          {/* 썸네일 (있을 때만) */}
          {showImage && p.thumb && imgOk && (
            <div className="relative aspect-[16/9] overflow-hidden">
              <img
                src={`/my-blog/portfolio/${p.thumb}`}
                alt=""
                loading="lazy"
                decoding="async"
                onError={() => setImgOk(false)}
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
              {!p.thumb && p.project && (
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
                {visible.map((t) => (
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
