import type { Slot } from "../api/courts";

type Props = {
  locationId: number;
  date: string;
  slots: Slot[];
  times: string[];
  rowHeight: string;
  rowGap: string;
  blockGap: string;
};

export default function LocationRow({
  locationId,
  date,
  slots,
  times,
  rowHeight,
  rowGap,
  blockGap,
}: Props) {
  const availabilityByTime = slots.reduce((acc, slot) => {
    if (!slot.available) return acc;

    acc[slot.time] = (acc[slot.time] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleClick = () => {
    const url =
      locationId === 6
        ? `https://jensenstennis.intrac.com.au/tennis/book.cfm?location=${locationId}&date=${date}&court=283`
        : `https://jensenstennis.intrac.com.au/tennis/book.cfm?location=${locationId}&date=${date}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${times.length}, minmax(0, 1fr))`,
        gap: blockGap,
        marginBottom: rowGap,
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
                ? `${time}: ${count} courts available, click to book`
                : `${time}: no courts available`
            }
            onClick={() => {
              if (isAvailable) handleClick();
            }}
            onMouseEnter={(e) => {
              if (!isAvailable) return;

              e.currentTarget.style.transform = "scale(1.08)";
              e.currentTarget.style.boxShadow =
                "0 8px 20px rgba(34,197,94,0.35)";
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
              height: rowHeight,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "14px",
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
  );
}