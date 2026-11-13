// Framer Motion's animation features, loaded on demand by AppLayout's
// <LazyMotion> (audit V11). Keeping them in their own module lets Vite split
// them into an async chunk, so the entry bundle only carries the small `m`
// components. domAnimation covers everything the app uses: animate/exit,
// variants, whileInView and hover/tap. Nothing uses layout or drag (those
// would need domMax).
import { domAnimation } from "framer-motion";

export default domAnimation;
