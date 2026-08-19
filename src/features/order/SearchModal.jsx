import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import useClickOutside from "../../hooks/useClickOutside";
import useLockBodyScroll from "../../hooks/useLockBodyScroll";
import useFocusTrap from "../../hooks/useFocusTrap";

import MainButton from "../../ui/MainButton";
import InputField from "../../ui/InputField";
import SectionHeader from "../../ui/SectionHeader";

import { X } from "lucide-react";

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query) return;
    navigate(`/order/${query}`);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-charcoal/50 z-50 flex items-start justify-center pt-32">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search your order"
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

        <SectionHeader title={"Search Your Order"} icon={""} />

        <div className="flex gap-3 md:flex-row flex-col">
          <div className="flex-1">
            <InputField
              ref={inputRef}
              id={"orderId"}
              type={"text"}
              name={"orderId"}
              placeholder={"Enter your order ID..."}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchSubmit(e);
                }
              }}
              isRequired
            />
          </div>
          <MainButton
            onClick={handleSearchSubmit}
            content={"Search"}
            size="medium"
            variant="quiet"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
