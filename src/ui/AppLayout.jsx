import { Outlet, useNavigation } from "react-router";
import { LazyMotion, MotionConfig } from "framer-motion";
import { ToastProvider } from "../context/ToastContext";

// Animation features load async (audit V11): every animated element is an
// `m.*` component, which renders immediately and starts animating once this
// chunk arrives. `strict` makes a stray full `motion.*` component throw in
// development, so the full bundle can't creep back into the entry chunk.
const loadMotionFeatures = () =>
  import("../motionFeatures").then((module) => module.default);

// Root shell shared by every route: motion config, toasts and the navigation
// progress bar. The visible chrome comes from the child layout route —
// SiteLayout (full header/footer) or CheckoutLayout (slim, audit V13).
const AppLayout = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    // Governs every framer-motion component in the tree (floating header,
    // mobile drawer, announcement bar, cart overview, toasts, scroll
    // reveals). CSS transitions and style-bound motion values (useParallax)
    // are unaffected by this — they consume usePrefersReducedMotion().
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadMotionFeatures} strict>
        <ToastProvider>
          <div>
            {/* Slim top progress indicator — React Router already keeps the
              previous page mounted while a loader runs, so we only need a cue
              that a navigation is in flight, not a full-page takeover. */}
            {isLoading && (
              <div
                role="progressbar"
                aria-label="Loading"
                className="fixed top-0 left-0 right-0 z-70 h-[3px] bg-brass animate-pulse"
              />
            )}
            <Outlet />
          </div>
        </ToastProvider>
      </LazyMotion>
    </MotionConfig>
  );
};

export default AppLayout;
