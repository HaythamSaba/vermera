import { useEffect } from "react";

// Mirrors useDocumentTitle: only page-level route components should call
// this — never a component that can also be rendered embedded inside
// another page (e.g. Cart) — since each mounted call unconditionally
// overwrites the single <meta name="description"> tag in index.html. Pass a
// falsy description to skip (e.g. an embedded render's page-level caller
// already owns the description).
export default function useMetaDescription(description) {
  useEffect(() => {
    if (!description) return;
    const meta = document.querySelector('meta[name="description"]');
    if (!meta) return;
    meta.setAttribute("content", description);
  }, [description]);
}
