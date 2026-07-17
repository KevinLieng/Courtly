import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { CourtOption } from "../utils/availabilityWindows";
import styles from "./courtSelectionModal.module.css";

export type CourtModalData = {
  venueName: string;
  mapsUrl: string;
  windowLabel: string;
  courts: CourtOption[];
  timetableUrl?: string;
};

type Props = {
  data: CourtModalData | null;
  onClose: () => void;
};

export default function CourtSelectionModal({ data, onClose }: Props) {
  useEffect(() => {
    if (!data) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [data, onClose]);

  if (!data) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="court-selection-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles.headerText}>
            <a
              id="court-selection-title"
              href={data.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.venueName}
            >
              {data.venueName}
            </a>
            <span className={styles.windowLabel}>{data.windowLabel}</span>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <ul className={styles.courtList}>
          {data.courts.map((court) => (
            <li key={court.court} className={styles.courtRow}>
              <span className={styles.courtName}>{court.name ?? `Court ${court.court + 1}`}</span>
              <a
                href={court.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.bookButton}
              >
                Book
              </a>
            </li>
          ))}
        </ul>

        {data.timetableUrl && (
          <div className={styles.footer}>
            <a
              href={data.timetableUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.timetableLink}
            >
              Open full timetable
            </a>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
