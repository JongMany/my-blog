// apps/portfolio/src/pages/ProjectDetail.tsx
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { projects } from "../service/portfolio";

export default function ProjectDetail() {
  const { slug = "" } = useParams();
  const p = projects.find((x) => x.slug === slug);

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
          {/* {p.period && <span className="t-chip">{p.period}</span>} */}
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
