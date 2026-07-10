import styles from "./timeFilterButtons.module.css";

export type TimePeriod = "morning" | "afternoon" | "evening";

type Option = { label: string; value: TimePeriod | null };

const OPTIONS: Option[] = [
  { label: "All day", value: null },
  { label: "Morning", value: "morning" },
  { label: "Afternoon", value: "afternoon" },
  { label: "Evening", value: "evening" },
];

type Props = {
  active: TimePeriod | null;
  onChange: (next: TimePeriod | null) => void;
};

export default function TimeFilterButtons({ active, onChange }: Props) {
  return (
    <div className={styles.segment} role="group" aria-label="Time of day">
      {OPTIONS.map(({ label, value }) => {
        const isActive = active === value;
        return (
          <button
            key={label}
            type="button"
            aria-pressed={isActive}
            className={`${styles.option} ${isActive ? styles.optionActive : ""}`}
            onClick={() => onChange(value)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
