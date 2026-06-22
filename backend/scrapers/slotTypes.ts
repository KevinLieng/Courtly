export type AvailabilitySlot = {
  court: number;
  time: string;
  available: boolean;
  bookingUrl: string;
};

export type AvailabilityResponse = {
  status: "ok" | "error" | "invalid-date";
  slots: AvailabilitySlot[];
};