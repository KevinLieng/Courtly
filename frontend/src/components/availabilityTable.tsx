import { useEffect, useState } from "react";
import { getAvailability, type Slot } from "../api/courts";
import LocationRow from "./locationRow";

type Props = {
  date: string;
};

type Location = {
  id: number;
  name: string;
};

type LoadedLocation = Location & {
  slots: Slot[];
};

const LOCATIONS: Location[] = [
  { id: 2, name: "Surry Hills" },
  { id: 3, name: "Alexandria" },
  { id: 4, name: "Beaconsfield" },
  { id: 5, name: "Glebe" },
  { id: 6, name: "Rosebery" },
];

const TIMES = Array.from(
  { length: 16 },
  (_, i) => `${String(i + 7).padStart(2, "0")}:00`
);

const LABEL_WIDTH = "150px";
const ROW_HEIGHT = "58px";
const ROW_GAP = "12px";
const BLOCK_GAP = "4px";

// wide enough to show all time slots on desktop/laptop
const TIME_GRID_MIN_WIDTH = "1120px";

export default function AvailabilityTable({ date }: Props) {
  const [rows, setRows] = useState<LoadedLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!date) return;

    let cancelled = false;

    setRows([]);
    setLoaded(false);
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const results = await Promise.all(
          LOCATIONS.map(async (location) => {
            const data = await getAvailability(location.id, date);

            return {
              ...location,
              status: data.status,
              slots: data.slots,
            };
          })
        );

        if (cancelled) return;

        // Show valid locations even if slots are empty.
        // Hide only invalid/unbookable locations.
        const visibleRows: LoadedLocation[] = results
          .filter((row) => row.status === "ok")
          .map((row) => ({
            id: row.id,
            name: row.name,
            slots: row.slots,
          }));

        setRows(visibleRows);
        setLoaded(true);
      } catch (err) {
        console.error("Failed to load availability:", err);

        if (!cancelled) {
          setRows([]);
          setLoaded(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 2000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [date]);

  if (loading) {
    return (
      <div
        style={{
          marginTop: "48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "14px",
          color: "#94a3b8",
          fontWeight: 700,
        }}
      >
        <style>
          {`
            @keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>

        <div
          style={{
            width: "34px",
            height: "34px",
            border: "4px solid #334155",
            borderTopColor: "#22c55e",
            borderRadius: "999px",
            animation: "spin 0.8s linear infinite",
          }}
        />

        <div>Checking availability...</div>
      </div>
    );
  }

  if (loaded && rows.length === 0) {
    return (
      <div
        style={{
          marginTop: "48px",
          textAlign: "center",
          color: "#94a3b8",
          fontWeight: 700,
          fontSize: "18px",
        }}
      >
        This date is not bookable yet.
      </div>
    );
  }

  return (
    <div
      style={{
        width: "min(98vw, 1600px)",
        marginTop: "36px",
        display: "grid",
        gridTemplateColumns: `${LABEL_WIDTH} minmax(0, 1fr)`,
        columnGap: "10px",
        alignItems: "start",
      }}
    >
      {/* Fixed location names */}
      <div>
        {/* Spacer for time header */}
        <div style={{ height: "24px", marginBottom: "8px" }} />

        {rows.map((row) => (
          <div
            key={row.id}
            style={{
              height: ROW_HEIGHT,
              marginBottom: ROW_GAP,
              display: "flex",
              alignItems: "center",
              fontWeight: 700,
              fontSize: "20px",
              whiteSpace: "nowrap",
              color: "#94a3b8",
            }}
          >
            {row.name}
          </div>
        ))}
      </div>

      {/* Only the time grid scrolls */}
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
              gridTemplateColumns: `repeat(${TIMES.length}, minmax(0, 1fr))`,
              gap: BLOCK_GAP,
              height: "24px",
              marginBottom: "8px",
              textAlign: "center",
              fontSize: "12px",
              color: "#666",
              alignItems: "center",
            }}
          >
            {TIMES.map((time) => (
              <div key={time}>{time}</div>
            ))}
          </div>

          {rows.map((row) => (
            <LocationRow
              key={row.id}
              locationId={row.id}
              date={date}
              slots={row.slots}
              times={TIMES}
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