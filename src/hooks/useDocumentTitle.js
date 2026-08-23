import { useEffect } from "react";

// Only page-level route components should call this — never a component
// that can also be rendered embedded inside another page (e.g. Cart), since
// each mounted call unconditionally overwrites document.title. Pass a
// falsy title to skip (e.g. an embedded render's page-level caller already
// owns the title).
export default function useDocumentTitle(title) {
  useEffect(() => {
    if (!title) return;
    document.title = `${title} | Vermera`;
  }, [title]);
}
