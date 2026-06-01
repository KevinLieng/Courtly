export type Court = {
  id: string;
  name: string;
  suburb: string;
  bookingUrl: string;
};

export type Availability = {
  courtId: string;
  date: string;
  slots: { time: string; available: boolean }[];
};

export type Slot = {
  court: number;
  time: string;
  available: boolean;
};