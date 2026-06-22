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
    <div style={{ marginBottom: "0px" }}>
      <input
        type="date"
        value={date}
        min={minDate}
        max={maxDate}
        onChange={(e) => setDate(e.target.value)}
        style={{
          padding: "8px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />
    </div>
  );
}