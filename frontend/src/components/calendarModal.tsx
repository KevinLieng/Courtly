import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./calendarModal.module.css";

type Props = {
  open: boolean;
  value: string;
  minDate: string;
  maxDate: string;
  onSelect: (date: string) => void;
  onClose: () => void;
};

const WEEKDAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Always 42 cells (6 full weeks) so the grid height never shifts between
// months with 4 vs 6 visible weeks. Monday-start, matching the rest of the
// app's date formatting (en-AU) and the native picker it replaces.
function getMonthGrid(year: number, month: number): Date[] {
  const firstOfMonth = new Date(year, month, 1);
  const leadingCount = (firstOfMonth.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - leadingCount);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export default function CalendarModal({ open, value, minDate, maxDate, onSelect, onClose }: Props) {
  const [viewYear, setViewYear] = useState(() => Number(value.slice(0, 4)));
  const [viewMonth, setViewMonth] = useState(() => Number(value.slice(5, 7)) - 1);

  // Re-sync the visible month to the current selection each time it opens.
  useEffect(() => {
    if (!open) return;
    setViewYear(Number(value.slice(0, 4)));
    setViewMonth(Number(value.slice(5, 7)) - 1);
  }, [open, value]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const todayValue = getLocalDateString(new Date());
  const cells = getMonthGrid(viewYear, viewMonth);

  const prevMonthLastDay = getLocalDateString(new Date(viewYear, viewMonth, 0));
  const nextMonthFirstDay = getLocalDateString(new Date(viewYear, viewMonth + 1, 1));
  const canGoPrev = prevMonthLastDay >= minDate;
  const canGoNext = nextMonthFirstDay <= maxDate;

  function goPrev() {
    const d = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }

  function goNext() {
    const d = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString("en-AU", {
    month: "long",
    year: "numeric",
  });

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label="Choose a date"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <button
            type="button"
            className={styles.navButton}
            onClick={goPrev}
            disabled={!canGoPrev}
            aria-label="Previous month"
          >
            ‹
          </button>
          <span className={styles.monthLabel}>{monthLabel}</span>
          <button
            type="button"
            className={styles.navButton}
            onClick={goNext}
            disabled={!canGoNext}
            aria-label="Next month"
          >
            ›
          </button>
        </div>

        <div className={styles.weekdayRow}>
          {WEEKDAY_LABELS.map((label) => (
            <span key={label} className={styles.weekdayLabel}>
              {label}
            </span>
          ))}
        </div>

        <div className={styles.grid}>
          {cells.map((cellDate) => {
            const cellValue = getLocalDateString(cellDate);
            const inMonth = cellDate.getMonth() === viewMonth;
            const inRange = cellValue >= minDate && cellValue <= maxDate;
            const isSelected = cellValue === value;
            const isToday = cellValue === todayValue;

            return (
              <button
                key={cellValue}
                type="button"
                disabled={!inRange}
                onClick={() => onSelect(cellValue)}
                className={[
                  styles.cell,
                  !inMonth ? styles.cellOutside : "",
                  isSelected ? styles.cellSelected : "",
                ].join(" ")}
                aria-current={isToday ? "date" : undefined}
                aria-pressed={isSelected}
              >
                {cellDate.getDate()}
                {isToday && <span className={styles.todayDot} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}
