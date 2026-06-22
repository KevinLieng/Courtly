import type { Slot } from "../api/courtsApi";

type Props = {
  locationId: string;
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

    if (!acc[slot.time]) {
      acc[slot.time] = {
        count: 0,
        bookingUrl: slot.bookingUrl,
      };
    }

    acc[slot.time].count += 1;

    return acc;
  }, {} as Record<string, { count: number; bookingUrl: string }>);

  const handleClick = (time: string) => {
    const availability = availabilityByTime[time];

    if (!availability) return;

    window.open(availability.bookingUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      data-location-id={locationId}
      data-date={date}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${times.length}, minmax(0, 1fr))`,
        gap: blockGap,
        marginBottom: rowGap,
      }}
    >
      {times.map((time) => {
        const availability = availabilityByTime[time];
        const count = availability?.count || 0;
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
              if (isAvailable) handleClick(time);
            }}
            onMouseEnter={(e) => {
              if (!isAvailable) return;

              e.currentTarget.style.transform = "scale(1.08)";
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
                : "#2B2F36",

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