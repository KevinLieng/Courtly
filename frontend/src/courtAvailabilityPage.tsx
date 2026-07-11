import { useState } from "react";
import { useAvailability } from "./hooks/useAvailability";
import SevenDayDisplay from "./components/sevenDayDisplay";
import AvailabilityGrid from "./components/courtGrid";
import SkeletonGrid from "./components/skeletonGrid";
import CurrentLocationButton from "./components/currentButton";
import TimeFilterButtons, { type TimePeriod } from "./components/timeFilterButtons";
import DurationToggle, { type Duration } from "./components/durationToggle";
import SwipeHint from "./components/swipeHint";
import { times as allTimes } from "./components/gridConstants";
import { floorToHalfHour } from "./utils/availabilityWindows";
import styles from "./courtAvailabilityPage.module.css";

function timesInHourRange(times: string[], startHour: number, endHourExclusive: number) {
  return times.filter((t) => {
    const h = parseInt(t.split(":")[0], 10);
    return h >= startHour && h < endHourExclusive;
  });
}

const TIME_PERIODS: Record<TimePeriod, string[]> = {
  morning: timesInHourRange(allTimes, 6, 12),
  afternoon: timesInHourRange(allTimes, 12, 17),
  evening: timesInHourRange(allTimes, 17, 23),
};

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatSummaryDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const weekday = d.toLocaleDateString("en-AU", { weekday: "long" });
  const dayNum = d.getDate();
  const month = d.toLocaleDateString("en-AU", { month: "long" });
  return `${weekday}, ${dayNum} ${month}`;
}

export default function CourtAvailability() {
  const today = getLocalDateString();

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateString = getLocalDateString(maxDate);

  const [date, setDate] = useState(() => getLocalDateString());
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [activePeriod, setActivePeriod] = useState<TimePeriod | null>(null);
  const [duration, setDuration] = useState<Duration>(1);

  // Every half-hour column in the (time-of-day-filtered) grid is rendered
  // as a start time; whether a given window actually fits is decided by
  // computeAvailability looking at the real underlying slots, not by
  // whether the window's end happens to also be a selectable column.
  const periodTimes = activePeriod ? TIME_PERIODS[activePeriod] : allTimes;

  // For today, hide start times already in the past — e.g. at 2:10pm only
  // "14:00" onward remains selectable.
  const filteredTimes = date === today
    ? periodTimes.filter((t) => t >= floorToHalfHour(new Date()))
    : periodTimes;

  const { locations, loading, invalidDate, error, status, retry } = useAvailability(date, userLocation);

  const loaded = status !== "idle" && status !== "loading";

  const visibleLocations = locations.filter((location) =>
    location.slots.some((slot) => slot.available && filteredTimes.includes(slot.time))
  );

  return (
    <div className={styles.page}>
      <div className={styles.panel}>

        {/* Controls: two rows on the left, duration toggle + legend on the right */}
        <div className={styles.controls}>
          <div className={styles.controlRows}>
            <div className={styles.controlRow1}>
              <SevenDayDisplay date={date} setDate={setDate} minDate={today} maxDate={maxDateString} />
            </div>
            <div className={styles.controlRow2}>
              <div className={styles.timeFilterWrap}>
                <TimeFilterButtons active={activePeriod} onChange={setActivePeriod} />
              </div>
              <div className={styles.locationWrap}>
                <CurrentLocationButton onLocationFound={setUserLocation} locationActive={!!userLocation} />
              </div>
            </div>
          </div>
          <div className={styles.controlsRight}>
            <div className={styles.durationWrap}>
              <DurationToggle value={duration} onChange={setDuration} />
            </div>
            <div className={styles.legend} aria-label="Availability legend">
              <span className={styles.legendTitle}>Courts</span>
              <div className={styles.legendItems}>
                {([
                  { cls: styles.swatchLow,  label: "1–2" },
                  { cls: styles.swatchMid,  label: "3–5" },
                  { cls: styles.swatchHigh, label: "6+"  },
                ] as const).map(({ cls, label }) => (
                  <span key={label} className={styles.legendItem}>
                    <span className={`${styles.legendSwatch} ${cls}`} aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && <SkeletonGrid />}

        {/* Error */}
        {!loading && error && (
          <div className={styles.stateError}>
            <p>Failed to load availability.</p>
            <button type="button" className={styles.retryButton} onClick={retry}>
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && loaded && !invalidDate && !error && visibleLocations.length === 0 && (
          <p className={styles.state}>No courts available for this date.</p>
        )}

        {/* Results */}
        {!loading && visibleLocations.length > 0 && (
          <>
            <div className={styles.summaryRow}>
              <div className={styles.summaryLeft}>
                <span className={styles.venueCount}>
                  {visibleLocations.length} {visibleLocations.length === 1 ? "venue" : "venues"} available
                </span>
                <span className={styles.summaryDate}>{formatSummaryDate(date)}</span>
              </div>
              <span className={styles.summaryHint}>Numbers = courts. Tap to book.</span>
            </div>
            <SwipeHint />
            <AvailabilityGrid
              date={date}
              times={filteredTimes}
              locations={visibleLocations}
              duration={duration}
              showRangeLabels={activePeriod !== null}
            />
          </>
        )}
      </div>
    </div>
  );
}
