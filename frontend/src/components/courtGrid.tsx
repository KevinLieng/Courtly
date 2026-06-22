import LocationRow from "./locationRow";
import type { Slot } from "../api/courtsApi";

const times = Array.from(
  { length: 16 },
  (_, i) => `${String(i + 7).padStart(2, "0")}:00`
);

const LABEL_WIDTH = "190px";
const ROW_HEIGHT = "54px";
const ROW_GAP = "10px";
const BLOCK_GAP = "4px";
const TIME_GRID_MIN_WIDTH = "1040px";

type LocationAvailability = {
  id: string;
  name: string;
  distance?: number;
  slots: Slot[];
};

type AvailabilityGridProps = {
  date: string;
  locations: LocationAvailability[];
};

export default function AvailabilityGrid({
  date,
  locations,
}: AvailabilityGridProps) {
  return (
    <div
      style={{
        width: "min(98vw, 1600px)",
        marginTop: "24px",
        display: "grid",
        gridTemplateColumns: `${LABEL_WIDTH} minmax(0, 1fr)`,
        columnGap: "8px",
        alignItems: "start",
      }}
    >
      {/* Fixed left location names */}
      <div>
        <div style={{ height: "24px", marginBottom: "8px" }} />

        {locations.map((location) => (
          <div
            key={location.id}
            style={{
              height: ROW_HEIGHT,
              marginBottom: ROW_GAP,
              display: "flex",
              alignItems: "center",
              fontWeight: 700,
              fontSize: "16px",
              whiteSpace: "nowrap",
              color: "#94a3b8",
              paddingLeft: "14px",
              boxSizing: "border-box",
            }}
          >
            <span>{location.name}</span>

            {location.distance !== undefined && (
              <div
                style={{
                  marginTop: "4px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#64748b",
                  paddingLeft: "8px",
                }}
              >
                ~ {location.distance.toFixed(1)} km
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Only this side scrolls */}
      <div
        style={{
          overflowX: "auto",
          paddingBottom: "10px",
        }}
      >
        <div
          style={{
            minWidth: TIME_GRID_MIN_WIDTH,
          }}
        >
          {/* Time header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${times.length}, minmax(0, 1fr))`,
              gap: BLOCK_GAP,
              height: "24px",
              marginBottom: "8px",
              textAlign: "center",
              fontSize: "12px",
              color: "#666",
              alignItems: "center",
            }}
          >
            {times.map((time) => (
              <div key={time}>{time}</div>
            ))}
          </div>

          {locations.map((location) => (
            <LocationRow
              key={location.id}
              locationId={location.id}
              date={date}
              slots={location.slots}
              times={times}
              rowHeight={ROW_HEIGHT}
              rowGap={ROW_GAP}
              blockGap={BLOCK_GAP}
            />
          ))}
        </div>
      </div>
    </div>
  );
}