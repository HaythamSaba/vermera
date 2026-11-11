import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { getCategoryLabel, supportedCategories } from "./categories";

const tabClass = (isActive) =>
  `shrink-0 py-3 -mb-px border-b-2 whitespace-nowrap text-sm cursor-pointer transition-colors duration-300 ${
    isActive
      ? "border-espresso text-espresso font-medium"
      : "border-transparent text-taupe hover:text-charcoal"
  }`;

// Edge fades, by which sides still have hidden tabs. The fade is the cue
// that the row scrolls (the scrollbar is too subtle on phones, and absent on
// iOS); when every tab fits, no mask is applied at all.
const EDGE_FADE = {
  both: "[mask-image:linear-gradient(to_right,transparent,black_2rem,black_calc(100%_-_2rem),transparent)]",
  start: "[mask-image:linear-gradient(to_right,transparent,black_2rem)]",
  end: "[mask-image:linear-gradient(to_right,black_calc(100%_-_2rem),transparent)]",
  none: "",
};

// Which edges have content scrolled out of view (1px tolerance for
// sub-pixel scroll positions).
function getOverflowEdges(el) {
  const canScrollStart = el.scrollLeft > 1;
  const canScrollEnd = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
  if (canScrollStart && canScrollEnd) return "both";
  if (canScrollStart) return "start";
  if (canScrollEnd) return "end";
  return "none";
}

// Underlined text tabs (not boxed buttons) on one hairline, scrolling
// sideways on narrow screens. Changing category keeps sort/price/search.
function CategoriesList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";

  const rowRef = useRef(null);
  const [overflowEdges, setOverflowEdges] = useState("none");

  // Track which edges can scroll: on scroll, and whenever the row's size
  // changes (rotation, resize, font swap). ResizeObserver also reports once
  // on observe, which sets the initial state.
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const update = () => setOverflowEdges(getOverflowEdges(row));
    row.addEventListener("scroll", update, { passive: true });
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(row);
    return () => {
      row.removeEventListener("scroll", update);
      resizeObserver.disconnect();
    };
  }, []);

  // Keep the active tab visible (e.g. a "Sunglasses" link from the footer
  // landing on a phone). Scrolls only the row horizontally, never the page.
  useEffect(() => {
    const row = rowRef.current;
    const active = row?.querySelector('[aria-pressed="true"]');
    if (!row || !active) return;
    const rowBox = row.getBoundingClientRect();
    const tabBox = active.getBoundingClientRect();
    const fadeRoom = 32; // keep the tab clear of the 2rem edge fade
    if (tabBox.left < rowBox.left + fadeRoom) {
      row.scrollLeft -= rowBox.left + fadeRoom - tabBox.left;
    } else if (tabBox.right > rowBox.right - fadeRoom) {
      row.scrollLeft += tabBox.right - (rowBox.right - fadeRoom);
    }
  }, [activeCategory]);

  const handleSelect = (slug) => {
    const next = new URLSearchParams(searchParams);
    if (slug === "all") {
      next.delete("category");
    } else {
      next.set("category", slug);
    }
    const query = next.toString();
    navigate(query ? `/products?${query}` : "/products");
  };

  return (
    <div
      ref={rowRef}
      role="group"
      aria-label="Filter by category"
      // overflow-y-hidden: overflow-x-auto would otherwise make the tabs'
      // -mb-px (overlapping the hairline) scroll vertically by 1px.
      className={`flex gap-6 sm:gap-8 overflow-x-auto overflow-y-hidden border-b border-stone ${EDGE_FADE[overflowEdges]}`}
    >
      {["all", ...supportedCategories].map((slug) => (
        <button
          type="button"
          key={slug}
          aria-pressed={activeCategory === slug}
          className={tabClass(activeCategory === slug)}
          onClick={() => handleSelect(slug)}
        >
          {slug === "all" ? "All" : getCategoryLabel(slug)}
        </button>
      ))}
    </div>
  );
}

export default CategoriesList;
