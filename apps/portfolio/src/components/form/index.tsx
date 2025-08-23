// import { useForm } from "@tanstack/react-form";
// import type { Project } from "../../store/portfolioStore";
// import { usePortfolioStore } from "../../store/portfolioStore"; // zustand 스토어 (upsert 등)

// type Props = {
//   initial?: Project;
//   onDone?: () => void; // 저장 후 콜백(닫기 등)
// };

// const cls = {
//   input:
//     "w-full rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-3.5 py-2 text-sm outline-none focus:[box-shadow:var(--ring)]",
//   btn: "rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-3 py-1.5 text-sm hover:bg-[var(--hover-bg)]",
//   chip: "t-chip text-xs",
//   label: "mb-1 block text-sm text-[var(--muted-fg)]",
//   err: "mt-1 text-xs text-red-500",
// };

// export default function ProjectForm({ initial, onDone }: Props) {
//   const upsert = usePortfolioStore((s) => s.upsert);
//   const items = usePortfolioStore((s) => s.items);

//   const isEditing = !!initial;

//   const form = useForm({
//     defaultValues: initial ?? {
//       slug: "",
//       title: "",
//       summary: "",
//       project: "",
//       date: "",
//       pinned: false,
//       tags: [],
//       thumb: "",
//       images: [],
//       body: [],
//       links: [],
//     },
//     onSubmit: async ({ value }) => {
//       // 신규 생성일 때 slug 중복 체크
//       if (!isEditing && items.some((x) => x.slug === value.slug.trim())) {
//         form.setFieldMeta("slug", (m) => ({
//           ...m,
//           errors: ["이미 존재하는 slug입니다"],
//           touchedErrors: ["이미 존재하는 slug입니다"],
//           isTouched: true,
//         }));
//         return;
//       }
//       // 빈 값 정리
//       const cleaned: Project = {
//         ...value,
//         slug: value.slug.trim(),
//         title: value.title.trim(),
//         summary: value.summary?.trim() || undefined,
//         project: value.project?.trim() || undefined,
//         date: value.date?.trim() || undefined,
//         thumb: value.thumb?.trim() || undefined,
//         tags: (value.tags ?? []).filter(Boolean),
//         images: (value.images ?? []).filter(Boolean),
//         body: (value.body ?? []).filter(Boolean),
//         links: (value.links ?? []).filter((l) => l.label && l.href),
//       };
//       upsert(cleaned, { prevSlug: initial?.slug });
//       onDone?.();
//     },
//   });

//   // 간단한 유효성 함수들
//   const requireMsg = (s?: string) =>
//     !s?.trim() ? "필수 항목입니다" : undefined;
//   const slugMsg = (s?: string) =>
//     !s?.trim()
//       ? "필수 항목입니다"
//       : /^[a-z0-9-]+$/.test(s)
//         ? undefined
//         : "소문자/숫자/하이픈만 허용";
//   const dateMsg = (s?: string) =>
//     !s || /^\d{4}(-\d{2})?$/.test(s) ? undefined : "YYYY 또는 YYYY-MM";

//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         form.handleSubmit();
//       }}
//       className="space-y-4"
//     >
//       {/* slug / title */}
//       <div className="grid gap-3 md:grid-cols-2">
//         <form.Field
//           name="slug"
//           validators={{ onChange: ({ value }) => slugMsg(value) }}
//         >
//           {(field) => (
//             <div>
//               <label className={cls.label}>Slug</label>
//               <input
//                 value={field.state.value ?? ""}
//                 onChange={(e) => field.handleChange(e.target.value)}
//                 onBlur={field.handleBlur}
//                 placeholder="tv-trading-chart"
//                 className={cls.input}
//               />
//               {field.state.meta.isTouched && field.state.meta.errors?.[0] && (
//                 <p className={cls.err}>{String(field.state.meta.errors[0])}</p>
//               )}
//             </div>
//           )}
//         </form.Field>

//         <form.Field
//           name="title"
//           validators={{ onChange: ({ value }) => requireMsg(value) }}
//         >
//           {(field) => (
//             <div>
//               <label className={cls.label}>Title</label>
//               <input
//                 value={field.state.value ?? ""}
//                 onChange={(e) => field.handleChange(e.target.value)}
//                 onBlur={field.handleBlur}
//                 placeholder="프로젝트 제목"
//                 className={cls.input}
//               />
//               {field.state.meta.isTouched && field.state.meta.errors?.[0] && (
//                 <p className={cls.err}>{String(field.state.meta.errors[0])}</p>
//               )}
//             </div>
//           )}
//         </form.Field>
//       </div>

//       {/* project / date */}
//       <div className="grid gap-3 md:grid-cols-2">
//         <form.Field name="project">
//           {(field) => (
//             <div>
//               <label className={cls.label}>Project(소속/메타)</label>
//               <input
//                 value={field.state.value ?? ""}
//                 onChange={(e) => field.handleChange(e.target.value)}
//                 onBlur={field.handleBlur}
//                 placeholder="Coinness Exchange"
//                 className={cls.input}
//               />
//             </div>
//           )}
//         </form.Field>
//         <form.Field
//           name="date"
//           validators={{ onChange: ({ value }) => dateMsg(value) }}
//         >
//           {(field) => (
//             <div>
//               <label className={cls.label}>Date</label>
//               <input
//                 value={field.state.value ?? ""}
//                 onChange={(e) => field.handleChange(e.target.value)}
//                 onBlur={field.handleBlur}
//                 placeholder="2025-08"
//                 className={cls.input}
//               />
//               {field.state.meta.isTouched && field.state.meta.errors?.[0] && (
//                 <p className={cls.err}>{String(field.state.meta.errors[0])}</p>
//               )}
//             </div>
//           )}
//         </form.Field>
//       </div>

//       {/* summary */}
//       <form.Field name="summary">
//         {(field) => (
//           <div>
//             <label className={cls.label}>Summary</label>
//             <textarea
//               rows={4}
//               value={field.state.value ?? ""}
//               onChange={(e) => field.handleChange(e.target.value)}
//               onBlur={field.handleBlur}
//               placeholder="요약"
//               className={cls.input}
//             />
//           </div>
//         )}
//       </form.Field>

//       {/* pinned / thumb */}
//       <div className="flex flex-wrap items-center gap-3">
//         <form.Field name="pinned">
//           {(field) => (
//             <label className="inline-flex items-center gap-2 text-sm">
//               <input
//                 type="checkbox"
//                 checked={!!field.state.value}
//                 onChange={(e) => field.handleChange(e.target.checked)}
//                 onBlur={field.handleBlur}
//               />
//               상단 고정(Pinned)
//             </label>
//           )}
//         </form.Field>
//         <form.Field name="thumb">
//           {(field) => (
//             <div className="flex-1 min-w-[220px]">
//               <label className={cls.label}>Thumbnail URL</label>
//               <input
//                 value={field.state.value ?? ""}
//                 onChange={(e) => field.handleChange(e.target.value)}
//                 onBlur={field.handleBlur}
//                 placeholder="https://..."
//                 className={cls.input}
//               />
//             </div>
//           )}
//         </form.Field>
//       </div>

//       {/* tags */}
//       <form.Field name="tags">
//         {(field) => {
//           const arr = (field.state.value ?? []) as string[];
//           return (
//             <div>
//               <div className="mb-1 text-sm font-medium">Tags</div>
//               <div className="flex flex-wrap gap-1.5">
//                 {arr.map((t, i) => (
//                   <span
//                     key={`tag.${i}.${t}`}
//                     className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2 py-[2px]"
//                   >
//                     <input
//                       value={t}
//                       onChange={(e) => field.replaceValue(i, e.target.value)}
//                       className="w-24 bg-transparent text-xs outline-none"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => field.removeValue(i)}
//                       className="text-[10px] text-[var(--muted-fg)] hover:underline"
//                     >
//                       ✕
//                     </button>
//                   </span>
//                 ))}
//                 <button
//                   type="button"
//                   onClick={() => field.pushValue("")}
//                   className={cls.chip}
//                 >
//                   + 추가
//                 </button>
//               </div>
//             </div>
//           );
//         }}
//       </form.Field>

//       {/* images */}
//       <form.Field name="images">
//         {(field) => {
//           const arr = (field.state.value ?? []) as string[];
//           return (
//             <div>
//               <div className="mb-1 text-sm font-medium">Images</div>
//               <div className="space-y-1.5">
//                 {arr.map((url, i) => (
//                   <div
//                     key={`img.${i}.${url}`}
//                     className="flex items-center gap-2"
//                   >
//                     <input
//                       value={url}
//                       onChange={(e) => field.replaceValue(i, e.target.value)}
//                       placeholder="https:// 이미지 URL"
//                       className={cls.input + " flex-1"}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => field.removeValue(i)}
//                       className={cls.btn + " text-xs"}
//                     >
//                       삭제
//                     </button>
//                   </div>
//                 ))}
//                 <button
//                   type="button"
//                   onClick={() => field.pushValue("")}
//                   className={cls.chip}
//                 >
//                   + 추가
//                 </button>
//               </div>
//             </div>
//           );
//         }}
//       </form.Field>

//       {/* body (문단 배열이 아니라 단일 문자열로 쓰는 경우) */}
//       <form.Field name="body">
//         {(field) => (
//           <div>
//             <div className="mb-1 text-sm font-medium">본문 (Markdown 가능)</div>
//             <textarea
//               rows={8}
//               value={(field.state.value as any) ?? ""}
//               onChange={(e) => field.handleChange(e.target.value as any)}
//               className={cls.input}
//               placeholder="상세 내용을 입력하세요"
//             />
//           </div>
//         )}
//       </form.Field>

//       <form.Field name="links">
//         {(field) => {
//           const arr = (field.state.value ?? []) as {
//             label: string;
//             href: string;
//           }[];

//           const patch = (
//             i: number,
//             part: Partial<{ label: string; href: string }>
//           ) => {
//             const base = arr[i] ?? { label: "", href: "" };
//             field.replaceValue(i, { ...base, ...part });
//           };

//           return (
//             <div>
//               <div className="mb-1 text-sm font-medium">Links</div>
//               <div className="space-y-1.5">
//                 {arr.map((lk, i) => (
//                   <div
//                     key={`link.${i}.${lk.href}`}
//                     className="grid grid-cols-5 gap-2"
//                   >
//                     <input
//                       value={lk.label}
//                       onChange={(e) => patch(i, { label: e.target.value })}
//                       placeholder="라벨"
//                       className={cls.input + " col-span-2"}
//                     />
//                     <input
//                       value={lk.href}
//                       onChange={(e) => patch(i, { href: e.target.value })}
//                       placeholder="https://..."
//                       className={cls.input + " col-span-3"}
//                     />
//                     <div className="col-span-5 -mt-1">
//                       <button
//                         type="button"
//                         onClick={() => field.removeValue(i)}
//                         className="text-xs text-[var(--muted-fg)] hover:underline"
//                       >
//                         삭제
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//                 <button
//                   type="button"
//                   onClick={() => field.pushValue({ label: "", href: "" })}
//                   className={cls.chip}
//                 >
//                   + 추가
//                 </button>
//               </div>
//             </div>
//           );
//         }}
//       </form.Field>

//       {/* 하단 액션 & 상태 */}
//       <form.Subscribe
//         selector={(s) => [s.canSubmit, s.isSubmitting, s.isDirty] as const}
//       >
//         {([canSubmit, isSubmitting, isDirty]) => (
//           <div className="flex items-center gap-2 pt-2">
//             <button
//               type="submit"
//               disabled={!canSubmit || isSubmitting || !isDirty}
//               className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm text-[var(--primary-ink)] disabled:opacity-50"
//             >
//               {isSubmitting ? "저장 중…" : "저장"}
//             </button>
//             {onDone && (
//               <button type="button" onClick={onDone} className={cls.btn}>
//                 취소
//               </button>
//             )}
//             <span className="ml-auto text-xs text-[var(--muted-fg)]">
//               {isSubmitting
//                 ? "저장 중…"
//                 : isDirty
//                   ? "변경사항 있음"
//                   : "변경사항 없음"}
//             </span>
//           </div>
//         )}
//       </form.Subscribe>
//     </form>
//   );
// }
// apps/portfolio/src/components/ProjectForm.tsx
import * as React from "react";
import { useForm } from "@tanstack/react-form";
import type { Project } from "../../store/portfolioStore";
import { usePortfolioStore } from "../../store/portfolioStore";

type Link = { label: string; href: string };

// 폼 내부 값은 운영 타입(Project)와 분리해서 쓰는 게 타입/UX에 유리
type FormValues = {
  slug: string;
  title: string;
  summary?: string;
  project?: string;
  date?: string; // YYYY 또는 YYYY-MM
  pinned: boolean;
  tags: string[];
  thumb?: string;
  images: string[]; // DataURL 또는 URL
  body: string; // textarea 하나로 관리 후 저장 시 배열 등으로 변환
  links: Link[];
};

type Props = {
  initial?: Project;
  onDone?: () => void;
};

const cls = {
  input:
    "w-full rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-3.5 py-2 text-sm outline-none focus:[box-shadow:var(--ring)]",
  btn: "rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-3 py-1.5 text-sm hover:bg-[var(--hover-bg)]",
  chip: "t-chip text-xs",
  label: "mb-1 block text-sm text-[var(--muted-fg)]",
  err: "mt-1 text-xs text-red-500",
};

export default function ProjectForm({ initial, onDone }: Props) {
  const upsert = usePortfolioStore((s) => s.upsert);
  const items = usePortfolioStore((s) => s.items);
  const isEditing = !!initial;

  // 🔧 이미지 섹션에서 쓰는 훅(규칙 준수: 최상단에 선언)
  const imgFileInputRef = React.useRef<HTMLInputElement | null>(null);
  const imgDragFromRef = React.useRef<number | null>(null);

  // Project -> FormValues 매핑 (초기 상태)
  const initialForm: FormValues = initial
    ? {
        slug: initial.slug ?? "",
        title: (initial as any).title ?? "",
        summary: (initial as any).summary ?? "",
        project: (initial as any).project ?? "",
        date: (initial as any).date ?? "",
        pinned: !!(initial as any).pinned,
        tags: Array.isArray((initial as any).tags) ? (initial as any).tags : [],
        thumb: (initial as any).thumb ?? "",
        images: Array.isArray((initial as any).images)
          ? (initial as any).images
          : [],
        // Project.body가 string[] 이라고 가정 → 첫 요소만 textarea에 넣음
        body: Array.isArray((initial as any).body)
          ? ((initial as any).body[0] ?? "")
          : ((initial as any).body ?? ""),
        links: Array.isArray((initial as any).links)
          ? (initial as any).links
          : [],
      }
    : {
        slug: "",
        title: "",
        summary: "",
        project: "",
        date: "",
        pinned: false,
        tags: [],
        thumb: "",
        images: [],
        body: "",
        links: [],
      };

  const form = useForm({
    defaultValues: initialForm,
    onSubmit: async ({ value }) => {
      // 신규 생성 시 slug 중복 체크
      if (!isEditing && items.some((x) => x.slug === value.slug.trim())) {
        form.setFieldMeta("slug", (m) => ({
          ...m,
          errors: ["이미 존재하는 slug입니다"],
          isTouched: true,
        }));
        return;
      }

      // 저장 전 정리/매핑 → Project 타입으로
      const cleaned: Project = {
        // 기존 필드 유지가 필요하면 initial을 먼저 펼친다
        ...(initial as any),
        slug: value.slug.trim(),
        title: value.title.trim(),
        summary: value.summary?.trim() || undefined,
        project: value.project?.trim() || undefined,
        date: value.date?.trim() || undefined,
        pinned: !!value.pinned,
        tags: (value.tags ?? []).map((t) => t.trim()).filter(Boolean),
        thumb: value.thumb?.trim() || (value.images[0] ?? undefined),
        images: (value.images ?? []).filter(Boolean),
        // 본문은 배열 형태로 저장(필요시 여기서 split("\n\n") 등 가공)
        body: value.body?.trim() ? [value.body.trim()] : [],
        links: (value.links ?? []).filter((l) => l.label && l.href),
      } as Project;

      upsert(cleaned, { prevSlug: initial?.slug });
      onDone?.();
    },
  });

  // 간단한 유효성
  const requireMsg = (s?: string) =>
    !s?.trim() ? "필수 항목입니다" : undefined;
  const slugMsg = (s?: string) =>
    !s?.trim()
      ? "필수 항목입니다"
      : /^[a-z0-9-]+$/.test(s)
        ? undefined
        : "소문자/숫자/하이픈만 허용";
  const dateMsg = (s?: string) =>
    !s || /^\d{4}(-\d{2})?$/.test(s) ? undefined : "YYYY 또는 YYYY-MM";

  // ---- 이미지 헬퍼들 (훅X 일반 함수) ----
  const filesToDataURLs = async (files: File[]) => {
    const imgs = files.filter((f) => f.type.startsWith("image/"));
    const urls = await Promise.all(
      imgs.map(
        (f) =>
          new Promise<string>((res, rej) => {
            const fr = new FileReader();
            fr.onload = () => res(String(fr.result));
            fr.onerror = () => rej(fr.error);
            fr.readAsDataURL(f);
          })
      )
    );
    return urls;
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      {/* 상단: 이미지 + slug/title */}
      <div className="grid gap-3 md:grid-cols-2">
        {/* images – 다중 업로드/드롭/붙여넣기 + 미리보기 + 정렬 + 커버 지정 */}
        <form.Field name="images">
          {(field) => {
            const arr = (field.state.value ?? []) as string[];

            const addFiles = async (files: File[]) => {
              if (!files.length) return;
              const urls = await filesToDataURLs(files);
              const cur = Array.isArray(field.state.value)
                ? (field.state.value as string[])
                : [];
              field.setValue([...cur, ...urls]);
            };

            const onDragStart = (idx: number) => (e: React.DragEvent) => {
              imgDragFromRef.current = idx;
              e.dataTransfer.effectAllowed = "move";
            };
            const onDragOver = (e: React.DragEvent) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
            };
            const onDrop = (toIdx: number) => (e: React.DragEvent) => {
              e.preventDefault();
              const from = imgDragFromRef.current;
              imgDragFromRef.current = null;
              if (from == null || from === toIdx) return;
              const next = [...arr];
              const [moved] = next.splice(from, 1);
              next.splice(toIdx, 0, moved);
              field.setValue(next);
              // 커버(맨 앞) 변경 시 thumb 자동 동기화 (옵션)
              if (toIdx === 0 || from === 0) {
                form.setFieldValue("thumb", next[0] ?? "");
              }
            };

            const onPaste = async (e: React.ClipboardEvent) => {
              const files = Array.from(e.clipboardData.files || []);
              if (files.some((f) => f.type.startsWith("image/"))) {
                e.preventDefault();
                await addFiles(files);
              }
            };
            const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
              const files = Array.from(e.target.files ?? []);
              await addFiles(files);
              if (imgFileInputRef.current) imgFileInputRef.current.value = "";
            };

            return (
              <div>
                <div className="mb-1 text-sm font-medium">Images</div>

                {/* 드롭존 / 붙여넣기 */}
                <div
                  onDragOver={onDragOver}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files ?? []);
                    void addFiles(files);
                  }}
                  onPaste={onPaste}
                  className="mb-3 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--muted-fg)] hover:bg-[var(--hover-bg)]"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => imgFileInputRef.current?.click()}
                      className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-3 py-1.5 text-sm hover:bg-[var(--hover-bg)]"
                    >
                      파일 선택
                    </button>
                    <span className="text-xs">
                      이미지를 <b>여러 개 선택</b>하거나, 이 영역에{" "}
                      <b>드래그 앤 드롭</b> / <b>붙여넣기(Ctrl/⌘+V)</b> 해주세요
                    </span>
                  </div>
                  <input
                    ref={imgFileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={onPick}
                  />
                </div>

                {/* 썸네일/정렬/삭제가 가능한 그리드 */}
                {arr.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {arr.map((src, i) => (
                      <div
                        key={`${src.slice(0, 32)}.${i}`}
                        className="group relative overflow-hidden rounded-xl border border-[var(--border)]"
                        draggable
                        onDragStart={onDragStart(i)}
                        onDragOver={onDragOver}
                        onDrop={onDrop(i)}
                        title="드래그해서 순서 변경"
                      >
                        <img
                          src={src}
                          alt={`image-${i}`}
                          className="aspect-video w-full object-cover"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
                        <div className="absolute inset-x-2 top-2 flex items-center gap-2">
                          <span className="rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                            {i + 1}
                          </span>
                        </div>
                        <div className="absolute inset-x-2 bottom-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              // 맨 앞으로 이동(=커버로)
                              const next = [...arr];
                              const [moved] = next.splice(i, 1);
                              next.unshift(moved);
                              field.setValue(next);
                              form.setFieldValue("thumb", next[0] ?? "");
                            }}
                            className="rounded-md bg-black/60 px-2 py-1 text-[10px] text-white hover:bg-black/70"
                            title="커버로 설정(맨 앞으로)"
                          >
                            커버
                          </button>
                          <button
                            type="button"
                            onClick={() => field.removeValue(i)}
                            className="ml-auto rounded-md bg-black/60 px-2 py-1 text-[10px] text-white hover:bg-black/70"
                            title="삭제"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[var(--muted-fg)]">
                    아직 추가된 이미지가 없습니다.
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        {/* slug / title */}
        <div className="space-y-3">
          <form.Field
            name="slug"
            validators={{ onChange: ({ value }) => slugMsg(value) }}
          >
            {(field) => (
              <div>
                <label className={cls.label}>Slug</label>
                <input
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="tv-trading-chart"
                  className={cls.input}
                />
                {field.state.meta.isTouched && field.state.meta.errors?.[0] && (
                  <p className={cls.err}>
                    {String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="title"
            validators={{ onChange: ({ value }) => requireMsg(value) }}
          >
            {(field) => (
              <div>
                <label className={cls.label}>Title</label>
                <input
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="프로젝트 제목"
                  className={cls.input}
                />
                {field.state.meta.isTouched && field.state.meta.errors?.[0] && (
                  <p className={cls.err}>
                    {String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>
      </div>

      {/* project / date */}
      <div className="grid gap-3 md:grid-cols-2">
        <form.Field name="project">
          {(field) => (
            <div>
              <label className={cls.label}>Project(소속/메타)</label>
              <input
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Coinness Exchange"
                className={cls.input}
              />
            </div>
          )}
        </form.Field>

        <form.Field
          name="date"
          validators={{ onChange: ({ value }) => dateMsg(value) }}
        >
          {(field) => (
            <div>
              <label className={cls.label}>Date</label>
              <input
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="2025-08"
                className={cls.input}
              />
              {field.state.meta.isTouched && field.state.meta.errors?.[0] && (
                <p className={cls.err}>{String(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      {/* summary */}
      <form.Field name="summary">
        {(field) => (
          <div>
            <label className={cls.label}>Summary</label>
            <textarea
              rows={4}
              value={field.state.value ?? ""}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="요약"
              className={cls.input}
            />
          </div>
        )}
      </form.Field>

      {/* pinned / thumb */}
      <div className="flex flex-wrap items-center gap-3">
        <form.Field name="pinned">
          {(field) => (
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
                onBlur={field.handleBlur}
              />
              상단 고정(Pinned)
            </label>
          )}
        </form.Field>

        <form.Field name="thumb">
          {(field) => (
            <div className="flex-1 min-w-[220px]">
              <label className={cls.label}>Thumbnail URL</label>
              <input
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="https://..."
                className={cls.input}
              />
            </div>
          )}
        </form.Field>
      </div>

      {/* tags */}
      <form.Field name="tags">
        {(field) => {
          const arr = (field.state.value ?? []) as string[];
          return (
            <div>
              <div className="mb-1 text-sm font-medium">Tags</div>
              <div className="flex flex-wrap gap-1.5">
                {arr.map((t, i) => (
                  <span
                    key={`tag.${i}.${t}`}
                    className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2 py-[2px]"
                  >
                    <input
                      value={t}
                      onChange={(e) => field.replaceValue(i, e.target.value)}
                      className="w-24 bg-transparent text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => field.removeValue(i)}
                      className="text-[10px] text-[var(--muted-fg)] hover:underline"
                    >
                      ✕
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => field.pushValue("")}
                  className={cls.chip}
                >
                  + 추가
                </button>
              </div>
            </div>
          );
        }}
      </form.Field>

      {/* body (단일 textarea → 저장 시 배열 등으로 매핑) */}
      <form.Field name="body">
        {(field) => (
          <div>
            <div className="mb-1 text-sm font-medium">본문 (Markdown 가능)</div>
            <textarea
              rows={8}
              value={field.state.value ?? ""}
              onChange={(e) => field.handleChange(e.target.value)}
              className={cls.input}
              placeholder="상세 내용을 입력하세요"
            />
          </div>
        )}
      </form.Field>

      {/* links: {label, href}[] */}
      <form.Field name="links">
        {(field) => {
          const arr = (field.state.value ?? []) as Link[];
          const patch = (i: number, part: Partial<Link>) => {
            const base = arr[i] ?? { label: "", href: "" };
            field.replaceValue(i, { ...base, ...part });
          };
          return (
            <div>
              <div className="mb-1 text-sm font-medium">Links</div>
              <div className="space-y-1.5">
                {arr.map((lk, i) => (
                  <div
                    key={`link.${i}.${lk.href}`}
                    className="grid grid-cols-5 gap-2"
                  >
                    <input
                      value={lk.label}
                      onChange={(e) => patch(i, { label: e.target.value })}
                      placeholder="라벨"
                      className={cls.input + " col-span-2"}
                    />
                    <input
                      value={lk.href}
                      onChange={(e) => patch(i, { href: e.target.value })}
                      placeholder="https://..."
                      className={cls.input + " col-span-3"}
                    />
                    <div className="col-span-5 -mt-1">
                      <button
                        type="button"
                        onClick={() => field.removeValue(i)}
                        className="text-xs text-[var(--muted-fg)] hover:underline"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => field.pushValue({ label: "", href: "" })}
                  className={cls.chip}
                >
                  + 추가
                </button>
              </div>
            </div>
          );
        }}
      </form.Field>

      {/* 하단 액션 & 상태 */}
      <form.Subscribe
        selector={(s) => [s.canSubmit, s.isSubmitting, s.isDirty] as const}
      >
        {([canSubmit, isSubmitting, isDirty]) => (
          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting || !isDirty}
              className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm text-[var(--primary-ink)] disabled:opacity-50"
            >
              {isSubmitting ? "저장 중…" : "저장"}
            </button>
            {onDone && (
              <button type="button" onClick={onDone} className={cls.btn}>
                취소
              </button>
            )}
            <span className="ml-auto text-xs text-[var(--muted-fg)]">
              {isSubmitting
                ? "저장 중…"
                : isDirty
                  ? "변경사항 있음"
                  : "변경사항 없음"}
            </span>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
