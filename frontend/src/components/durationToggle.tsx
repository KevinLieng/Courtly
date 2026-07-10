import styles from "./durationToggle.module.css";

type Props = { value: 1 | 2; onChange: (v: 1 | 2) => void };

export default function DurationToggle({ value, onChange }: Props) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Duration</span>
      <div className={styles.segment} role="group" aria-label="Session duration">
        {([1, 2] as const).map((h) => (
          <button
            key={h}
            type="button"
            aria-pressed={value === h}
            className={`${styles.option} ${value === h ? styles.optionActive : ""}`}
            onClick={() => onChange(h)}
          >
            {h === 1 ? "1 hour" : "2 hours"}
          </button>
        ))}
      </div>
    </div>
  );
}
