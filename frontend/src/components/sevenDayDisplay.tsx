import { useRef } from "react";
import styles from "./sevenDayDisplay.module.css";

type Props = {
  date: string;
  setDate: (date: string) => void;
  minDate: string;
  maxDate: string;
};

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function SevenDayDisplay({ date, setDate, minDate, maxDate }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const todayValue = getLocalDateString();

  const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      value: getLocalDateString(d),
      isToday: i === 0,
      topLine: i === 0 ? "Today" : d.toLocaleDateString("en-AU", { weekday: "short" }),
      bottomLine: d.toLocaleDateString("en-AU", { day: "numeric", month: "short" }),
    };
  });

  const isInSevenDays = nextSevenDays.some((d) => d.value === date);

  const farDate = !isInSevenDays ? new Date(date + "T00:00:00") : null;
  const farTopLine = farDate ? farDate.toLocaleDateString("en-AU", { weekday: "short" }) : null;
  const farBottomLine = farDate
    ? farDate.toLocaleDateString("en-AU", { day: "numeric", month: "short" })
    : null;

  return (
    <div className={styles.row} role="group" aria-label="Select date">
      {nextSevenDays.map((d) => {
        const selected = date === d.value;
        return (
          <button
            key={d.value}
            type="button"
            onClick={() => setDate(d.value)}
            className={[
              styles.day,
              selected ? styles.daySelected : "",
              d.isToday ? styles.dayToday : "",
            ].join(" ")}
            aria-pressed={selected}
            aria-current={d.value === todayValue ? "date" : undefined}
          >
            <span className={styles.dayTop}>{d.topLine}</span>
            <span className={styles.dayBottom}>{d.bottomLine}</span>
            {d.isToday && <span className={styles.todayDot} aria-hidden="true" />}
          </button>
        );
      })}

      {/* Calendar / far-date button */}
      <button
        type="button"
        onClick={() => inputRef.current?.showPicker()}
        className={[
          styles.day,
          styles.dayCalendar,
          !isInSevenDays ? styles.daySelected : "",
        ].join(" ")}
        aria-label="Open calendar to pick a date"
      >
        {!isInSevenDays ? (
          <>
            <span className={styles.dayTop}>{farTopLine}</span>
            <span className={styles.dayBottom}>{farBottomLine}</span>
          </>
        ) : (
          <>
            <svg
              className={styles.calIcon}
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <rect x="1" y="2.5" width="14" height="12.5" rx="2" stroke="currentColor" strokeWidth="1.25" />
              <line x1="1" y1="6.5" x2="15" y2="6.5" stroke="currentColor" strokeWidth="1.25" />
              <line x1="5" y1="1" x2="5" y2="4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              <line x1="11" y1="1" x2="11" y2="4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
            </svg>
            <span className={styles.dayBottom}>Calendar</span>
          </>
        )}
      </button>

      <input
        ref={inputRef}
        type="date"
        value={date}
        min={minDate}
        max={maxDate}
        onChange={(e) => e.target.value && setDate(e.target.value)}
        className={styles.hiddenInput}
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}
