import { Button } from "./button";

interface PrintButtonProps {
  /** 버튼 텍스트 */
  text?: string;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * PDF 저장 버튼 컴포넌트
 *
 * @description
 * - 브라우저의 인쇄 기능을 호출하는 버튼
 * - 인쇄 시에는 숨겨짐 (print:hidden)
 */
export function PrintButton({
  text = "PDF로 저장",
  className = "",
}: PrintButtonProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`flex justify-end pt-2 print:hidden ${className}`}>
      <Button
        onClick={handlePrint}
        className="inline-flex items-center rounded-xl bg-[var(--primary)] px-4 py-2 text-sm text-[var(--primary-ink)]"
      >
        {text}
      </Button>
    </div>
  );
}
