import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function BootRedirect() {
  const nav = useNavigate();
  useEffect(() => {
    const url = new URL(window.location.href);
    const to = url.searchParams.get("to");
    if (to) {
      url.searchParams.delete("to");
      const clean = url.pathname + (url.search ? url.search : "");
      window.history.replaceState({}, "", clean); // 주소 정리
      nav(to, { replace: true }); // 내부 라우팅
    }
  }, [nav]);
  return null;
}
