import styles from "./datePicker.module.css";

type DatePickerProps = {
  date: string;
  setDate: (date: string) => void;
  minDate: string;
  maxDate: string;
};

export default function DatePicker({
  date,
  setDate,
  minDate,
  maxDate,
}: DatePickerProps) {
  return (
    <div className={styles.wrapper}>
      <input
        type="date"
        value={date}
        min={minDate}
        max={maxDate}
        onChange={(e) => setDate(e.target.value)}
        className={styles.input}
      />
    </div>
  );
}
