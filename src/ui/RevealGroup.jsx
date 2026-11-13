import { m } from "framer-motion";
import { revealGroupVariants, STAGGER_MS } from "../utils/motion";

const MotionDiv = m.div;

// Reveals its children as one staggered scroll entrance, triggered once when
// the group first enters the viewport. Children must be motion elements with
// `variants={revealItemVariants(...)}`; they inherit hidden/visible from here.
const RevealGroup = ({ staggerMs = STAGGER_MS, className = "", children }) => (
  <MotionDiv
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={revealGroupVariants(staggerMs)}
    className={className}
  >
    {children}
  </MotionDiv>
);

export default RevealGroup;
