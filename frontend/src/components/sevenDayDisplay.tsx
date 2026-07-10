import styles from "./sevenDayDisplay.module.css";

type SevenDayDisplayProps = {
  date: string;
  setDate: (date: string) => void;
};

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function SevenDayDisplay({
  date,
  setDate,
}: SevenDayDisplayProps) {
  const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);

    return {
      value: getLocalDateString(d),
      label:
        i === 0
          ? "Today"
          : d.toLocaleDateString("en-AU", {
              weekday: "short",
              day: "numeric",
              month: "short",
            }),
    };
  });

  return (
    <div className={styles.row}>
      {nextSevenDays.map((d) => (
        <button
          key={d.value}
          onClick={() => setDate(d.value)}
          className={
            date === d.value
              ? `${styles.day} ${styles.daySelected}`
              : styles.day
          }
        >
          {d.label}
        </button>
      ))}
    </div>
  );
}
