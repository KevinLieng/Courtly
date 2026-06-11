import { useAvailability } from "../hooks/useAvailability";

type Props = {
  locationId: number;
  locationName: string;
  date: string;
};

export default function LocationRow({
  locationId,
  locationName,
  date,
}: Props) {
  const { slots, loading } = useAvailability(locationId, date);

  const times = Array.from(
    { length: 16 },
    (_, i) => `${String(i + 7).padStart(2, "0")}:00`
  );

  if (loading) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "140px auto",
          gap: "12px",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <div style={{ textAlign: "right", fontWeight: 600 }}>
          {locationName}
        </div>
        <div>Loading...</div>
      </div>
    );
  }

  const availabilityByTime = slots.reduce((acc, slot) => {
    if (!slot.available) return acc;

    acc[slot.time] = (acc[slot.time] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "140px auto",
        gap: "12px",
        alignItems: "center",
        marginBottom: "12px",
      }}
    >
      <div
        style={{
          textAlign: "right",
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        {locationName}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${times.length}, 60px)`,
          gap: "4px",
        }}
      >
        {times.map((time) => {
          const count = availabilityByTime[time] || 0;

          return (
            <div
              key={time}
              title={`${time}: ${count} courts available`}
              style={{
                height: "50px",
                backgroundColor: count > 0 ? "#22c55e" : "#e5e7eb",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                color: count > 0 ? "white" : "#999",
              }}
            >
              {count > 0 ? count : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}