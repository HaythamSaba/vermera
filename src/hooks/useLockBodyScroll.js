import { useLayoutEffect } from "react";

export default function useLockBodyScroll(active) {
  useLayoutEffect(() => {
    if (!active) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;

    document.body.style.overflow = "hidden";

    return () => (document.body.style.overflow = originalStyle);
  }, [active]);
}
