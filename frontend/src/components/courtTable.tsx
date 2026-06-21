import { useEffect, useState } from "react";
import LocationRow from "./locationRow";
import { getAvailability, type Slot } from "../api/courts";

type Location = {
  id: number;
  name: string;
};

type LoadedLocation = Location & {
  slots: Slot[];
};

const locations: Location[] = [
  { id: 2, name: "Surry Hills" },
  { id: 3, name: "Alexandria" },
  { id: 4, name: "Beaconsfield" },
  { id: 5, name: "Glebe" },
  { id: 6, name: "Rosebery" },
];

const times = Array.from(
  { length: 16 },
  (_, i) => `${String(i + 7).padStart(2, "0")}:00`
);

const LABEL_WIDTH = "125px";
const ROW_HEIGHT = "54px";
const ROW_GAP = "10px";
const BLOCK_GAP = "4px";

// Desktop will stretch nicely.
// Mobile will scroll once it gets smaller than this.
const TIME_GRID_MIN_WIDTH = "1040px";

export default function CourtAvailability() {
  const today = new Date().toISOString().split("T")[0];

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateString = maxDate.toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [rows, setRows] = useState<LoadedLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

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

  useEffect(() => {
    if (!date) return;

    let cancelled = false;

    setRows([]);
    setLoaded(false);
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const results = await Promise.all(
          locations.map(async (location) => {
            const data = await getAvailability(location.id, date);

            return {
              ...location,
              status: data.status,
              slots: data.slots,
            };
          })
        );

        if (cancelled) return;

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
              width: "120px",
              height: "42px",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              cursor: "pointer",
              backgroundColor: date === d.value ? "#2563eb" : "#fff",
              color: date === d.value ? "#fff" : "#000",
              fontWeight: date === d.value ? 600 : 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Date picker */}
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

      {loading && (
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
      )}

      {!loading && loaded && rows.length === 0 && (
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
      )}

      {!loading && rows.length > 0 && (
        <div
          style={{
            width: "min(98vw, 1600px)",
            marginTop: "36px",
            display: "grid",
            gridTemplateColumns: `${LABEL_WIDTH} minmax(0, 1fr)`,
            columnGap: "8px",
            alignItems: "start",
          }}
        >
          {/* Fixed left location names */}
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
                  fontSize: "16px",
                  whiteSpace: "nowrap",
                  color: "#94a3b8",
                  paddingLeft: "14px",
                  boxSizing: "border-box",
                }}
              >
                {row.name}
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

              {rows.map((row) => (
                <LocationRow
                  key={row.id}
                  locationId={row.id}
                  date={date}
                  slots={row.slots}
                  times={times}
                  rowHeight={ROW_HEIGHT}
                  rowGap={ROW_GAP}
                  blockGap={BLOCK_GAP}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}