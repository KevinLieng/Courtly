import styles from "./durationToggle.module.css";

export type Duration = 1 | 1.5 | 2;

type Props = { value: Duration; onChange: (v: Duration) => void };

const OPTIONS: { value: Duration; label: string }[] = [
  { value: 1, label: "1 hour" },
  { value: 1.5, label: "1.5 hours" },
  { value: 2, label: "2 hours" },
];

export default function DurationToggle({ value, onChange }: Props) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Duration</span>
      <div className={styles.segment} role="group" aria-label="Session duration">
        {OPTIONS.map(({ value: v, label }) => (
          <button
            key={v}
            type="button"
            aria-pressed={value === v}
            className={`${styles.option} ${value === v ? styles.optionActive : ""}`}
            onClick={() => onChange(v)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
