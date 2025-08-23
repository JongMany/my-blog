import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory, createPost, slugify } from "../../service/api";
import { qk } from "../../service/queryKey";
import { useNavigate } from "react-router-dom";
import MarkdownEditor from "../../components/MarkdownEditor";

export default function WritePage() {
  const qc = useQueryClient();
  const nav = useNavigate();

  const [title, setTitle] = React.useState("");
  const [contentMD, setContentMD] = React.useState(""); // ✅ Markdown 저장
  const [catInput, setCatInput] = React.useState("");
  const [cats, setCats] = React.useState<string[]>([]); // slug 배열

  const mCreate = useMutation({
    mutationFn: createPost,
    onSuccess: (p) => {
      qc.invalidateQueries({ queryKey: qk.posts() });
      qc.invalidateQueries({ queryKey: qk.categories() });
      p.categories.forEach((s) =>
        qc.invalidateQueries({ queryKey: qk.postsByCategory(s) })
      );
      nav(`/blog/post/${p.id}`);
    },
  });

  function addCat() {
    if (!catInput.trim()) return;
    const slug = slugify(catInput);
    if (!cats.includes(slug)) setCats([...cats, slug]);
    setCatInput("");
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">새 글 쓰기</h3>

      <div className="grid gap-3">
        <input
          className="rounded-md border border-[var(--border)] bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div>
          <div className="mb-2 flex gap-2">
            <input
              className="min-w-0 flex-1 rounded-md border border-[var(--border)] bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
              placeholder="카테고리 추가 (예: DevLog)"
              value={catInput}
              onChange={(e) => setCatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCat()}
            />
            <button
              onClick={addCat}
              className="rounded-md border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2 text-sm hover:bg-[var(--hover-bg)]"
            >
              추가
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--card-bg)] px-2 py-0.5 text-xs"
              >
                #{decodeURIComponent(c)}
                <button
                  onClick={() => setCats(cats.filter((x) => x !== c))}
                  className="opacity-60 hover:opacity-100"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <MarkdownEditor
          value={contentMD}
          onChange={setContentMD}
          height={520}
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            setTitle("");
            setContentMD("");
            setCats([]);
          }}
          className="rounded-md border border-[var(--border)] bg-[var(--card-bg)] px-4 py-2 text-sm hover:bg-[var(--hover-bg)]"
        >
          초기화
        </button>

        <button
          disabled={!title.trim() || !contentMD.trim() || mCreate.isPending}
          onClick={async () => {
            await Promise.all(
              cats.map((slug) => createCategory(decodeURIComponent(slug)))
            );
            mCreate.mutate({ title, content: contentMD, categories: cats });
          }}
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-40"
        >
          {mCreate.isPending ? "저장 중…" : "발행"}
        </button>
      </div>
    </div>
  );
}
