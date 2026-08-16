import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

// Single editable message shown in the bar. Bump ANNOUNCEMENT_ID whenever
// the copy changes so a past dismissal doesn't hide the new message.
const ANNOUNCEMENT_MESSAGE = "Complimentary delivery on orders over €500";
const ANNOUNCEMENT_ID = "delivery-eur500";
const STORAGE_KEY = `vermera-announcement-dismissed-${ANNOUNCEMENT_ID}`;

function readDismissed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

const MotionDiv = motion.div;

const AnnouncementBar = () => {
  const [isDismissed, setIsDismissed] = useState(readDismissed);

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // localStorage unavailable (e.g. private browsing) — dismiss for this render only
    }
    setIsDismissed(true);
  };

  return (
    <AnimatePresence>
      {!isDismissed && (
        <MotionDiv
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative bg-espresso text-cream"
        >
          <p className="text-center text-xs sm:text-sm tracking-wide py-2 px-10">
            {ANNOUNCEMENT_MESSAGE}
          </p>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss announcement"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-cream/70 hover:text-cream transition-colors"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
};

export default AnnouncementBar;
