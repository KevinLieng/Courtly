import { useState } from "react";
import LocationRow from "./locationRow";

export default function CourtAvailability() {
  const today = new Date().toISOString().split("T")[0];

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateString = maxDate.toISOString().split("T")[0];

  const [date, setDate] = useState(today);

  const locations = [
    { id: 2, name: "Surry Hills" },
    { id: 3, name: "Alexandria" },
    { id: 4, name: "Beaconsfield" },
    { id: 5, name: "Glebe" },
    { id: 6, name: "Roseberry" },
  ];

  const times = Array.from(
    { length: 16 },

    (_, i) => `${String(i + 7).padStart(2, "0")}:00`
  );

  const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);

    return {
      value: d.toISOString().split("T")[0],
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
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Quick-select buttons */}
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
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              cursor: "pointer",
              backgroundColor: date === d.value ? "#2563eb" : "#fff",
              color: date === d.value ? "#fff" : "#000",
              fontWeight: date === d.value ? "600" : "400",
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Date picker (today -> 30 days ahead) */}
      <div style={{ marginBottom: "24px" }}>
        <input
          type="date"
          value={date}
          min={today}
          max={maxDateString}
          onChange={(e) => setDate(e.target.value)}
          style={{
            padding: "8px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Time Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "140px auto",
          gap: "12px",
          marginBottom: "8px",
        }}
      >
        <div />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${times.length}, 60px)`,
            gap: "4px",
            textAlign: "center",
            fontSize: "12px",
            color: "#666",
          }}
        >
          {times.map((time) => (
            <div key={time}>{time}</div>
          ))}
        </div>
      </div>

      {locations.map((location) => (
        <LocationRow
          key={location.id}
          locationId={location.id}
          locationName={location.name}
          date={date}
        />
      ))}
    </div>
  );
}