export type AvailabilitySlot = {
  court: number;
  courtName?: string;
  time: string;
  available: boolean;
  bookingUrl: string;
};

export type AvailabilityResponse = {
  status: "ok" | "error" | "invalid-date";
  slots: AvailabilitySlot[];
  // Venue-level fallback link (e.g. the full booking calendar page),
  // separate from each slot's own direct bookingUrl.
  timetableUrl?: string;
};