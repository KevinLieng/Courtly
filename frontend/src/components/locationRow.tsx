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

  const handleClick = (time: string) => {
    const baseUrl =
      locationId === 6
        ? `https://jensenstennis.intrac.com.au/tennis/book.cfm?location=${locationId}&date=${date}&court=283`
        : `https://jensenstennis.intrac.com.au/tennis/book.cfm?location=${locationId}&date=${date}`;

    const url = `${baseUrl}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

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
          textAlign: "left",
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
          const isAvailable = count > 0;

          return (
            <div
                key={time}
                title={
                    isAvailable
                    ? `${time}: ${count} courts available (click to book)`
                    : `${time}: unavailable`
                }
                onClick={() => isAvailable && handleClick(time)}
                onMouseEnter={(e) => {
                    if (!isAvailable) return;
                    e.currentTarget.style.transform = "scale(1.08)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(34,197,94,0.35)";
                    e.currentTarget.style.filter = "brightness(1.05)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.filter = "none";
                }}
                onMouseDown={(e) => {
                    if (!isAvailable) return;
                    e.currentTarget.style.transform = "scale(0.96)";
                }}
                onMouseUp={(e) => {
                    if (!isAvailable) return;
                    e.currentTarget.style.transform = "scale(1.08)";
                }}
                style={{
                    height: "50px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    fontSize: "13px",
                    userSelect: "none",
                    cursor: isAvailable ? "pointer" : "default",
                    color: isAvailable ? "white" : "#9ca3af",

                    backgroundColor: isAvailable
                    ? count === 1
                        ? "#22c55e"
                        : count === 2
                        ? "#16a34a"
                        : "#15803d"
                    : "#e5e7eb",

                    transition: "all 0.15s ease",
                }}
                >
                {isAvailable ? count : ""}
                </div>
          );
        })}
      </div>
    </div>
  );
}