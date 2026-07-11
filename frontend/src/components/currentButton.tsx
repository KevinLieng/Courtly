import { useState } from "react";
import styles from "./currentButton.module.css";

type CurrentLocationButtonProps = {
  onLocationFound: (coords: { lat: number; lng: number }) => void;
  locationActive?: boolean;
};

function describeGeolocationError(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "Location permission denied.";
    case error.TIMEOUT:
      return "Location request timed out.";
    case error.POSITION_UNAVAILABLE:
      return "Location unavailable.";
    default:
      return "Could not get location.";
  }
}

export default function CurrentLocationButton({
  onLocationFound,
  locationActive,
}: CurrentLocationButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleUseCurrentLocation() {
    setError("");

    if (!navigator.geolocation) {
      setError("Location not supported.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);
        onLocationFound({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        setLoading(false);
        setError(describeGeolocationError(err));
      },
      { timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  }

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        onClick={handleUseCurrentLocation}
        disabled={loading}
        className={`${styles.button} ${locationActive ? styles.buttonActive : ""}`}
      >
        {loading ? "Locating..." : locationActive ? "Nearest first" : "Use my location"}
      </button>

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
