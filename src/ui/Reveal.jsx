import useScrollReveal from "../hooks/useScrollReveal";

// Mirrors utils/motion.js's DURATION constants — kept as literal Tailwind
// arbitrary-value strings (rather than built from the JS constants) since
// Tailwind's scanner only picks up classes that appear as complete static
// strings in source.
const DURATION_CLASS = {
  small: "duration-[200ms]",
  component: "duration-[400ms]",
  editorial: "duration-[800ms]",
};

// Thin scroll-entrance wrapper: fades + rises an element into place once it
// enters the viewport. Renders children in their final state immediately
// (no transition classes at all) when prefers-reduced-motion is on, per
// useScrollReveal's own reduced-motion handling.
const Reveal = ({
  as = "div",
  delay = 1000,
  duration = "editorial",
  distance = 40,
  className = "",
  children,
  ...rest
}) => {
  const Component = as;
  const { ref, isVisible, prefersReducedMotion } = useScrollReveal();

  if (prefersReducedMotion) {
    return (
      <Component className={className} {...rest}>
        {children}
      </Component>
    );
  }

  return (
    <Component
      ref={ref}
      className={`${className} transition-[opacity,transform] ease-out ${
        DURATION_CLASS[duration] ?? DURATION_CLASS.editorial
      }`.trim()}
      style={{
        opacity: isVisible ? 1 : 0,
        // Left unset once visible so any hover/focus transform utility on
        // the wrapped element (e.g. via `className`) still controls it
        // normally instead of being overridden by this inline style.
        transform: isVisible ? undefined : `translateY(${distance}px)`,
        transitionDelay: `${delay}ms`,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Reveal;
