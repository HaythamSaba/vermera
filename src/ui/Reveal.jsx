import useScrollReveal from "../hooks/useScrollReveal";
import { DURATION } from "../utils/motion";

// Thin scroll-entrance wrapper: fades + rises an element into place once it
// enters the viewport, via GSAP + ScrollTrigger under useScrollReveal.
// Reduced-motion and error fallbacks are handled entirely inside the hook
// (opt-in hiding), so this component just attaches the ref — no
// conditional rendering needed here.
const Reveal = ({
  as = "div",
  delay = 0,
  duration = "editorial",
  distance = 40,
  className = "",
  children,
  ...rest
}) => {
  const Component = as;
  const { ref } = useScrollReveal({
    distance,
    durationMs: DURATION[duration] ?? DURATION.editorial,
    delayMs: delay,
  });

  return (
    <Component ref={ref} className={className} {...rest}>
      {children}
    </Component>
  );
};

export default Reveal;
