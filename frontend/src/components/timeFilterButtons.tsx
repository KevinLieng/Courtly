import styles from "./timeFilterButtons.module.css";

export type TimePeriod = "morning" | "afternoon" | "evening";

const LABELS: Record<TimePeriod, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

const SUBLABELS: Record<TimePeriod, string> = {
  morning: "7am – 11am",
  afternoon: "12pm – 4pm",
  evening: "5pm – 10pm",
};

const PERIODS: TimePeriod[] = ["morning", "afternoon", "evening"];

type Props = {
  active: TimePeriod | null;
  onChange: (next: TimePeriod | null) => void;
};

export default function TimeFilterButtons({ active, onChange }: Props) {
  return (
    <div className={styles.row}>
      {PERIODS.map((period) => {
        const isActive = active === period;
        return (
          <button
            key={period}
            type="button"
            aria-pressed={isActive}
            className={`${styles.btn} ${isActive ? styles.btnActive : ""}`}
            onClick={() => onChange(isActive ? null : period)}
          >
            <span className={styles.label}>{LABELS[period]}</span>
            <span className={styles.sub}>{SUBLABELS[period]}</span>
          </button>
        );
      })}
    </div>
  );
}
