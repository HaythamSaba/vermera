import { Link } from "react-router";
import { motion } from "framer-motion";
import { navLinkClass } from "./HeaderDesktopNav";
import { EASE } from "../utils/motion";
import BrandMark from "./BrandMark";
import { SIZE_CLASSES, MARK_SIZE_CLASSES } from "../utils/motion";

const MotionSpan = motion.span;

const Logo = ({
  size = "primary",
  animate = false,
  className = "",
  onClick,
}) => {
  const lockup = (
    <span className="inline-flex items-center">
      <BrandMark className={`${MARK_SIZE_CLASSES[size]} w-auto shrink-0`} />
      <span
        className={`hidden md:inline font-serif font-medium tracking-[0.04em] -ml-3 ${SIZE_CLASSES[size]}`}
      >
        ermera
      </span>
    </span>
  );

  return (
    <Link
      to="/"
      onClick={onClick}
      className={`${navLinkClass} inline-flex items-center ${className}`}
    >
      {animate ? (
        <MotionSpan
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE.out }}
        >
          {lockup}
        </MotionSpan>
      ) : (
        lockup
      )}
    </Link>
  );
};

export default Logo;
