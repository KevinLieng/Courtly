import { useState } from "react";
import styles from "./currentButton.module.css";

type CurrentLocationButtonProps = {
  onLocationFound: (coords: { lat: number; lng: number }) => void;
  locationActive?: boolean;
};

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
      () => {
        setLoading(false);
        setError("Could not get location.");
      }
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
