import axios from "axios";

export type Slot = {
  court: number;
  time: string;
  available: boolean;
  bookingUrl: string;
};

export type AvailabilityStatus = "ok" | "invalid-date" | "error";

export type Provider =
  | "city-community"
  | "other-provider"; // add more later

export type LocationAvailability = {
  id: string;
  name: string;
  provider: Provider;
  status: AvailabilityStatus;
  slots: Slot[];
};

export type AvailabilityResponse = {
  date: string;
  locations: LocationAvailability[];
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
});

export async function getAvailability(
  date: string
): Promise<AvailabilityResponse> {
  console.log("Calling API with:", { date });

  const res = await api.get<AvailabilityResponse>("/api/availability", {
    params: { date },
  });

  return res.data;
}