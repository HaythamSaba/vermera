import { useState } from "react";
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

const   AnnouncementBar = () => {
  const [isDismissed, setIsDismissed] = useState(readDismissed);

  if (isDismissed) return null;

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // localStorage unavailable (e.g. private browsing) — dismiss for this render only
    }
    setIsDismissed(true);
  };

  return (
    <div className="relative bg-espresso text-cream">
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
    </div>
  );
};

export default AnnouncementBar;
