import axios from "axios";

export type Slot = {
  court: number;
  time: string;
  available: boolean;
};

export type AvailabilityResponse = {
  status: "ok" | "invalid-date";
  slots: Slot[];
};

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export async function getAvailability(location: number, date: string) {
  console.log("Calling API with:", { location, date });

  const res = await api.get<AvailabilityResponse>("/api/availability", {
    params: { location, date },
  });

  return res.data;
}