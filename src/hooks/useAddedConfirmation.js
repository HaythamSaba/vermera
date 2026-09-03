import { useEffect, useRef, useState } from "react";

const CONFIRM_MS = 1200;

// Tracks a brief "just confirmed" window after a successful action (e.g. an
// add-to-cart click) — for components that want to show a temporary
// confirmation state (a checkmark, a swapped label) at the exact point the
// user clicked, on top of (not instead of) the global toast, which may
// render off-screen from the click. Call `confirm()` from the action's own
// handler, after the action actually succeeds — never on a disabled/no-op
// click, so this never fires when nothing happened.
export default function useAddedConfirmation(durationMs = CONFIRM_MS) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const confirm = () => {
    setIsConfirmed(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsConfirmed(false), durationMs);
  };

  return [isConfirmed, confirm];
}
