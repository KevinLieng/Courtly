import { useState } from "react";
import { useAvailability } from "./hooks/useAvailability";
import DatePicker from "./components/datePicker";
import SevenDayDisplay from "./components/sevenDayDisplay";
import AvailabilityGrid from "./components/courtGrid";
import SkeletonGrid from "./components/skeletonGrid";
import CurrentLocationButton from "./components/currentButton";
import styles from "./courtAvailabilityPage.module.css";

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

  const { locations, loading, invalidDate, error, status, retry } =
    useAvailability(date, userLocation);

  const loaded = status !== "idle" && status !== "loading";

  const visibleLocations = locations.filter((location) =>
    location.slots.some((slot) => slot.available)
  );

  return (
    <div className={styles.page}>
      <div className={styles.controls}>
        <SevenDayDisplay date={date} setDate={setDate} />

        <DatePicker
          date={date}
          setDate={setDate}
          minDate={today}
          maxDate={maxDateString}
        />

        <CurrentLocationButton onLocationFound={setUserLocation} />
      </div>

      {loading && <SkeletonGrid />}

      {!loading && error && (
        <div className={styles.stateError}>
          <div>Failed to load availability.</div>
          <button type="button" className={styles.retryButton} onClick={retry}>
            Retry
          </button>
        </div>
      )}

      {!loading &&
        loaded &&
        !invalidDate &&
        !error &&
        visibleLocations.length === 0 && (
          <div className={styles.state}>No courts available for this date.</div>
        )}

      {!loading && visibleLocations.length > 0 && (
        <AvailabilityGrid date={date} locations={visibleLocations} />
      )}
    </div>
  );
}
