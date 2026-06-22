import { useState } from "react";

type CurrentLocationButtonProps = {
  onLocationFound: (coords: { lat: number; lng: number }) => void;
};

export default function CurrentLocationButton({
  onLocationFound,
}: CurrentLocationButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleUseCurrentLocation() {
    setError("");

    if (!navigator.geolocation) {
      setError("Location is not supported by this browser.");
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
        setError("Could not get your location.");
      }
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        marginBottom: "16px",
      }}
    >
      <button
        type="button"
        onClick={handleUseCurrentLocation}
        disabled={loading}
        style={{
          height: "42px",
          padding: "10px 16px",
          borderRadius: "8px",
          border: "1px solid #3A3F46",
          cursor: loading ? "not-allowed" : "pointer",
          backgroundColor: "#2B2F36",
          color: "#D7DEE8",
          fontWeight: 600,
          opacity: loading ? 0.7 : 1,
          marginTop: "12px",
        }}
      >
        {loading ? "Getting location..." : "Use current location"}
      </button>

      {error && (
        <div
          style={{
            color: "#f87171",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}