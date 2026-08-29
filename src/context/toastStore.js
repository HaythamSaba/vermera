import { createContext } from "react";

// Split into its own file (rather than living in ToastContext.jsx) because
// that file also exports the ToastProvider component — Fast Refresh breaks
// when a single file mixes component and non-component exports.
export const ToastContext = createContext(null);
