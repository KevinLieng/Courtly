import { useState } from "react";
import { useAvailability } from "./hooks/useAvailability";
import DatePicker from "./components/datePicker";
import SevenDayDisplay from "./components/sevenDayDisplay";
import AvailabilityGrid from "./components/courtGrid";
import CurrentLocationButton from "./components/currentButton";

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function CourtAvailability() {
  const today = getLocalDateString();

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateString = getLocalDateString(maxDate);

  const [date, setDate] = useState(() => getLocalDateString());

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const { locations, loading, invalidDate, error, status } =
    useAvailability(date, userLocation);

  const loaded = status !== "idle" && status !== "loading";

  const visibleLocations = locations.filter((location) =>
    location.slots.some((slot) => slot.available)
  );



  return (
    <div
      style={{
        padding: "1rem 2rem 2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <SevenDayDisplay date={date} setDate={setDate} />

      <DatePicker
        date={date}
        setDate={setDate}
        minDate={today}
        maxDate={maxDateString}
      />

      <CurrentLocationButton onLocationFound={setUserLocation} />

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

      {/* {!loading && invalidDate && (
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
      )} */}

      {!loading && error && (
        <div
          style={{
            marginTop: "48px",
            textAlign: "center",
            color: "#f87171",
            fontWeight: 700,
            fontSize: "18px",
          }}
        >
          Failed to load availability.
        </div>
      )}

      {!loading &&
        loaded &&
        !invalidDate &&
        !error &&
        visibleLocations.length === 0 && (
          <div
            style={{
              marginTop: "48px",
              textAlign: "center",
              color: "#94a3b8",
              fontWeight: 700,
              fontSize: "18px",
            }}
          >
            No courts available for this date.
          </div>
        )}

      {!loading && visibleLocations.length > 0 && (
        <AvailabilityGrid date={date} locations={visibleLocations} />
      )}
    </div>
  );
}