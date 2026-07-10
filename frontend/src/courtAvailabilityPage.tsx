import { useState } from "react";
import { useAvailability } from "./hooks/useAvailability";
import DatePicker from "./components/datePicker";
import SevenDayDisplay from "./components/sevenDayDisplay";
import AvailabilityGrid from "./components/courtGrid";
import SkeletonGrid from "./components/skeletonGrid";
import CurrentLocationButton from "./components/currentButton";
import TimeFilterButtons, { type TimePeriod } from "./components/timeFilterButtons";
import { times as allTimes } from "./components/gridConstants";
import styles from "./courtAvailabilityPage.module.css";

const TIME_PERIODS: Record<TimePeriod, string[]> = {
  morning:   ["07:00", "08:00", "09:00", "10:00", "11:00"],
  afternoon: ["12:00", "13:00", "14:00", "15:00", "16:00"],
  evening:   ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
};

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

  const [activePeriod, setActivePeriod] = useState<TimePeriod | null>(null);

  const filteredTimes = activePeriod ? TIME_PERIODS[activePeriod] : allTimes;

  const { locations, loading, invalidDate, error, status, retry } =
    useAvailability(date, userLocation);

  const loaded = status !== "idle" && status !== "loading";

  const visibleLocations = locations.filter((location) =>
    location.slots.some(
      (slot) => slot.available && filteredTimes.includes(slot.time)
    )
  );

  return (
    <div className={styles.page}>
      <div className={styles.controls}>
        <SevenDayDisplay date={date} setDate={setDate} />

        <div className={styles.controlsRow}>
          <DatePicker
            date={date}
            setDate={setDate}
            minDate={today}
            maxDate={maxDateString}
          />
          <CurrentLocationButton onLocationFound={setUserLocation} />
        </div>

        <TimeFilterButtons active={activePeriod} onChange={setActivePeriod} />
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
        <>
          <p className={styles.resultsSummary}>
            {visibleLocations.length === 1
              ? "1 location with courts available"
              : `${visibleLocations.length} locations with courts available`}
          </p>
          <AvailabilityGrid date={date} times={filteredTimes} locations={visibleLocations} />
        </>
      )}
    </div>
  );
}
