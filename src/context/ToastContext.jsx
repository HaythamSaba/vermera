import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { ToastContext } from "./toastStore";

const TOAST_DURATION = 2500;

const MotionDiv = motion.div;

// Single provider mounted once in AppLayout so any route/component can fire
// a transient confirmation (e.g. "added to cart") without prop-drilling.
// Reduced motion is handled for free — this renders inside AppLayout's
// MotionConfig(reducedMotion="user"), same as the mobile drawer/CartOverview.
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const showToast = useCallback((message) => {
    const id = nextId.current++;
    setToasts((current) => [...current, { id, message }]);
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, TOAST_DURATION);
  }, []);

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
              className="flex items-center gap-2 rounded-full bg-espresso text-cream px-4 py-2.5 shadow-soft text-sm"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              {toast.message}
            </MotionDiv>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
