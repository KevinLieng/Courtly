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
    <div
      style={{
        display: "flex",
        gap: "8px",
        marginBottom: "16px",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {nextSevenDays.map((d) => (
        <button
          key={d.value}
          onClick={() => setDate(d.value)}
          style={{
            width: "120px",
            height: "42px",
            padding: "10px 14px",
            borderRadius: "8px",
            border:
              date === d.value
                ? "1px solid #5B8CFF"
                : "1px solid #3A3F46",
            cursor: "pointer",
            backgroundColor: date === d.value ? "#2563EB" : "#2B2F36",
            color: date === d.value ? "#FFFFFF" : "#D7DEE8",
            fontWeight: date === d.value ? 600 : 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              date === d.value
                ? "0 0 0 1px rgba(37, 99, 235, 0.25)"
                : "none",
          }}
        >
          {d.label}
        </button>
      ))}
    </div>
  );
}