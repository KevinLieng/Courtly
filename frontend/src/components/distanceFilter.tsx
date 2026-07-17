import type { DistanceFilterValue } from "../hooks/useDistanceFilter";
import styles from "./distanceFilter.module.css";

type Props = { value: DistanceFilterValue; onChange: (v: DistanceFilterValue) => void };

const OPTIONS: { value: DistanceFilterValue; label: string }[] = [
  { value: 5, label: "5 km" },
  { value: 10, label: "10 km" },
  { value: 20, label: "20 km" },
  { value: "any", label: "Any" },
];

export default function DistanceFilter({ value, onChange }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.segment} role="group" aria-label="Distance filter">
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
