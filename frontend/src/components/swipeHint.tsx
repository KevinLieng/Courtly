import { useState } from "react";
import styles from "./swipeHint.module.css";

const DISMISS_KEY = "courtly-swipe-hint-dismissed";

export default function SwipeHint() {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISS_KEY) === "1"
  );

  if (dismissed) return null;

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  return (
    <div className={styles.hint} role="status">
      <span>Swipe sideways for more times. Landscape shows more slots.</span>
      <button
        type="button"
        className={styles.dismissButton}
        aria-label="Dismiss hint"
        onClick={dismiss}
      >
        ×
      </button>
    </div>
  );
}
