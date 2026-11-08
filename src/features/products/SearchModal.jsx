import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Search, X } from "lucide-react";
import useClickOutside from "../../hooks/useClickOutside";
import useLockBodyScroll from "../../hooks/useLockBodyScroll";
import useFocusTrap from "../../hooks/useFocusTrap";
import MainButton from "../../ui/MainButton";
import SectionHeader from "../../ui/SectionHeader";
import { getProductSearchPath } from "./productSearchPath";

// The header's search (desktop icon, floating header, mobile drawer): a
// product search that lands on /products?q=… (audit decision D2). Order
// lookup lives on the Profile page instead (OrderLookup).
const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const modalRef = useRef();
  const inputRef = useRef();

  // Every close path (X button, click outside, Escape, submit) goes through
  // this so the query is always cleared alongside notifying the parent.
  const handleClose = () => {
    onClose();
    setQuery("");
  };

  useClickOutside(modalRef, handleClose);

  useLockBodyScroll(isOpen);

  useFocusTrap(modalRef, isOpen);

  // Move focus into the dialog when it opens, matching the header's mobile
  // drawer convention.
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(getProductSearchPath(query));
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-charcoal/50 z-50 flex items-start justify-center pt-32">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
        className="bg-cream shadow-soft p-8 w-full max-w-2xl mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close search"
          className="absolute top-4 right-4 text-taupe hover:text-charcoal transition-colors"
        >
          <X size={24} className="cursor-pointer" aria-hidden="true" />
        </button>

        <SectionHeader title="Search Products" icon="" />

        <form
          role="search"
          onSubmit={handleSubmit}
          className="flex gap-3 md:flex-row flex-col"
        >
          <div className="flex-1 relative">
            <label htmlFor="headerProductSearch" className="sr-only">
              Search products
            </label>
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              id="headerProductSearch"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Bags, dresses, watches…"
              className="w-full border border-stone bg-cream p-3 pl-9"
            />
          </div>
          <MainButton
            type="submit"
            content="Search"
            size="medium"
            variant="quiet"
          />
        </form>
      </div>
    </div>
  );
};

export default SearchModal;
