import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import useClickOutside from "../../hooks/useClickOutside";
import useLockBodyScroll from "../../hooks/useLockBodyScroll";

import MainButton from "../../ui/MainButton";
import InputField from "../../ui/InputField";
import SectionHeader from "../../ui/SectionHeader";

import { X } from "lucide-react";

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const modalRef = useRef();

  // Every close path (X button, click outside, Escape, submit) goes through
  // this so the query is always cleared alongside notifying the parent.
  const handleClose = () => {
    onClose();
    setQuery("");
  };

  useClickOutside(modalRef, handleClose);

  useLockBodyScroll(isOpen);

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
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex items-start justify-center pt-32">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close search"
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
        >
          <X size={24} className="cursor-pointer" aria-hidden="true" />
        </button>

        <SectionHeader title={"Search Your Order"} icon={""} />

        <div className="flex gap-3 md:flex-row flex-col">
          <InputField
            id={"orderId"}
            type={"text"}
            name={"orderId"}
            placeholder={"Enter your order ID..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchSubmit(e);
              }
            }}
            required
          />
          <MainButton
            onClick={handleSearchSubmit}
            content={"Search"}
            size="medium"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
