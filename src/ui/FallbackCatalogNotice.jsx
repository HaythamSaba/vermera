import { Info } from "lucide-react";

// Shown when apiProducts couldn't reach DummyJSON and is serving the bundled
// mock snapshot instead, so the store never presents stale data as live.
const FallbackCatalogNotice = ({ className = "" }) => (
  <p className={`flex items-start gap-2 text-sm text-taupe ${className}`}>
    <Info className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
    <span>
      Showing a saved copy of the catalog because the live one couldn&apos;t
      be reached. Prices and stock may be out of date.
    </span>
  </p>
);

export default FallbackCatalogNotice;
