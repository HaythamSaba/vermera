import { useCallback, useRef, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { ToastContext } from "./toastStore";

const TOAST_DURATION = 2500;
// Toasts with an action (Undo, View cart) stay up longer so there's time to
// read the message and reach the button.
const ACTION_TOAST_DURATION = 6000;

const actionClass =
  "ml-1 font-medium underline underline-offset-4 decoration-cream/60 hover:decoration-cream cursor-pointer";

const MotionDiv = motion.div;

// Single provider mounted once in AppLayout so any route/component can fire
// a transient confirmation (e.g. "added to cart") without prop-drilling.
// Reduced motion is handled for free — this renders inside AppLayout's
// MotionConfig(reducedMotion="user"), same as the mobile drawer.
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  // showToast(message, { action }) — optional action is either a link
  // ({ label, to }) or a callback ({ label, onClick }); using it dismisses
  // the toast.
  const showToast = useCallback(
    (message, { action } = {}) => {
      const id = nextId.current++;
      setToasts((current) => [...current, { id, message, action }]);
      setTimeout(
        () => dismissToast(id),
        action ? ACTION_TOAST_DURATION : TOAST_DURATION,
      );
    },
    [dismissToast],
  );

  const renderAction = (toast) => {
    const { action } = toast;
    if (!action) return null;
    if (action.to) {
      return (
        <Link
          to={action.to}
          onClick={() => dismissToast(toast.id)}
          className={actionClass}
        >
          {action.label}
        </Link>
      );
    }
    return (
      <button
        type="button"
        onClick={() => {
          action.onClick();
          dismissToast(toast.id);
        }}
        className={actionClass}
      >
        {action.label}
      </button>
    );
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-6 right-6 z-80 flex flex-col-reverse gap-2 pointer-events-none"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <MotionDiv
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              // pointer-events-auto: the container ignores clicks so it never
              // blocks the page; a toast with an action must accept them.
              // surface-dark: cream focus ring on the espresso pill.
              className={`surface-dark flex items-center gap-2 rounded-full bg-espresso text-cream px-4 py-2.5 shadow-soft text-sm ${
                toast.action ? "pointer-events-auto" : ""
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              {toast.message}
              {renderAction(toast)}
            </MotionDiv>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
