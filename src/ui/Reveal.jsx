import { m } from "framer-motion";
import { DURATION, EASE } from "../utils/motion";

// Thin scroll-entrance wrapper: fades + rises an element into place the first
// time any part of it enters the viewport (Framer Motion `whileInView`, which
// also plays immediately for content that is already on screen at mount).
// Reduced motion is handled by AppLayout's MotionConfig(reducedMotion="user"):
// the rise is dropped and only the opacity fade remains.
const Reveal = ({
  as = "div",
  delay = 0,
  duration = "editorial",
  distance = 40,
  className = "",
  children,
  ...rest
}) => {
  const Component = m[as];

  return (
    <Component
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: (DURATION[duration] ?? DURATION.editorial) / 1000,
        delay: delay / 1000,
        ease: EASE.out,
      }}
      className={className}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Reveal;
