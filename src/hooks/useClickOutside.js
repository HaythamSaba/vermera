import { useEffect } from "react";

export default function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      // Deferred rather than called synchronously: on the triggering
      // mousedown, the browser's own default focus-shift (to the clicked
      // target, or to <body> if nothing focusable was clicked) hasn't
      // necessarily resolved yet — and can land *after* this handler (and
      // any state-driven "return focus to the trigger" effect it causes),
      // silently stealing focus back even from an explicit focus() call.
      // A macrotask defer lets that native step settle first, so a
      // consumer's focus-return effect reliably wins the race instead of
      // losing it. Escape/button-close don't go through this hook, so
      // they're unaffected.
      setTimeout(() => handler(event), 0);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
