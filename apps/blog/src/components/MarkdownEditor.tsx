import React from "react";
import { Editor } from "@toast-ui/react-editor";

type Props = {
  value: string;
  onChange: (md: string) => void;
  height?: number;
};

export default function EditorTui({ value, onChange, height = 520 }: Props) {
  const ref = React.useRef<Editor>(null);

  // 전역 테마(light/dark) 동기화
  const [isLight, setIsLight] = React.useState(
    (document.documentElement.getAttribute("data-theme") ?? "dark") === "light"
  );
  React.useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsLight(
        (document.documentElement.getAttribute("data-theme") ?? "dark") ===
          "light"
      );
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  // ▼ 프리뷰 표시 상태 (초기: 숨김)
  const [showPreview, setShowPreview] = React.useState(false);

  // 초기/토글 시 내장 프리뷰 스타일 전환
  React.useEffect(() => {
    const ins = ref.current?.getInstance() as any;
    if (!ins || typeof ins.changePreviewStyle !== "function") return;
    // showPreview=true → 'vertical'(좌·우 분할), false → 'tab'(단일 편집)
    ins.changePreviewStyle(showPreview ? "vertical" : "tab");
  }, [showPreview]);

  // 이미지 업로드 → Data URL 삽입 (후에 S3 등으로 교체 가능)
  function addImageBlobHook(
    blob: Blob,
    callback: (url: string, altText: string) => void
  ) {
    const reader = new FileReader();
    reader.onload = () =>
      callback(String(reader.result), (blob as any).name || "image");
    reader.readAsDataURL(blob);
  }

  // YouTube 삽입
  function insertYoutube() {
    const url = prompt("YouTube URL을 입력하세요");
    if (!url) return;
    const m = url.match(/(?:v=|\/)([A-Za-z0-9_-]{11})(?:\S+)?$/);
    const id = m?.[1];
    if (!id) return alert("유효한 YouTube 링크가 아닙니다.");
    const embed = `\n<iframe width="720" height="405" src="https://www.youtube.com/embed/${id}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>\n`;
    (ref.current?.getInstance() as any)?.insertText(embed);
  }

  function handleChange() {
    const md = (ref.current?.getInstance() as any)?.getMarkdown() ?? "";
    onChange(md);
  }

  return (
    <div className="space-y-2">
      {/* 상단 액션 바 */}
      <div className="flex items-center justify-end gap-2">
        <button type="button" onClick={insertYoutube} className="t-btn text-xs">
          YouTube 추가
        </button>
        <button
          type="button"
          onClick={() => setShowPreview((v) => !v)}
          className="t-btn t-btn--primary text-xs"
        >
          {showPreview ? "미리보기 닫기" : "미리보기 열기"}
        </button>
      </div>

      {/* Toast UI Editor 본체 (내장 프리뷰를 토글) */}
      <div className={showPreview ? "tui-eq" : undefined}>
        <Editor
          ref={ref}
          initialValue={value || ""}
          theme={isLight ? undefined : "dark"}
          // 초기엔 프리뷰 숨김 상태로 시작 → 'tab'
          previewStyle="tab"
          height={`${height}px`}
          initialEditType="markdown"
          usageStatistics={false}
          hideModeSwitch={true} // Markdown/WYSIWYG 탭은 숨김 (우린 마크다운만)
          toolbarItems={[
            ["heading", "bold", "italic", "strike"],
            ["hr", "quote"],
            ["ul", "ol", "task", "indent", "outdent"],
            ["table", "link"],
            ["image", "code", "codeblock"],
          ]}
          hooks={{
            addImageBlobHook: (
              blob: Blob,
              callback: (url: string, altText: string) => void
            ) => {
              addImageBlobHook(blob, callback);
              return false; // 내부 업로더 중단
            },
          }}
          events={{ change: handleChange }}
          language="ko-KR"
        />
      </div>
    </div>
  );
}
