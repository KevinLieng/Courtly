import { cityCommunityScraper } from "./cityCommunityScraper";
import { parklandsScraper } from "./parklandsScraper";
import type { AvailabilityResponse } from "./slotTypes";

type Provider = "city-community" | "parklands";

type LocationConfig = {
  id: string; // your app's clean ID
  name: string; // display name
  provider: Provider;
  providerLocationId: number; // the ugly ID used in the booking URL
};

type LocationAvailability = {
  id: string;
  name: string;
  provider: Provider;
  status: AvailabilityResponse["status"];
  slots: AvailabilityResponse["slots"];
};

type GetAvailabilityResponse = {
  date: string;
  locations: LocationAvailability[];
};

const locations: LocationConfig[] = [
  {
    id: "surry-hills",
    name: "Surry Hills",
    provider: "city-community",
    providerLocationId: 2,
  },
  {
    id: "alexandria",
    name: "Alexandria",
    provider: "city-community",
    providerLocationId: 3,
  },
  {
    id: "beaconsfield",
    name: "Beaconsfield",
    provider: "city-community",
    providerLocationId: 4,
  },
  {
    id: "glebe",
    name: "Glebe",
    provider: "city-community",
    providerLocationId: 5,
  },
  {
    id: "rosebery",
    name: "Rosebery",
    provider: "city-community",
    providerLocationId: 6,
  },
  {
    id: "centennial-park",
    name: "Centennial Park ",
    provider: "parklands",
    providerLocationId: 55,
  },
  {
    id: "moore-park",
    name: "Moore Park ",
    provider: "parklands",
    providerLocationId: 72,
  },
  
];

async function scrapeLocation(
  location: LocationConfig,
  date: string
): Promise<LocationAvailability> {
  try {
    if (location.provider === "city-community") {
      const data = await cityCommunityScraper(location.providerLocationId, date);

      return {
        id: location.id,
        name: location.name,
        provider: location.provider,
        status: data.status,
        slots: data.slots,
      };
    }

    if (location.provider === "parklands") {
      const data = await parklandsScraper(location.providerLocationId, date);

      return {
        id: location.id,
        name: location.name,
        provider: location.provider,
        status: data.status,
        slots: data.slots,
      };
    }

    return {
      id: location.id,
      name: location.name,
      provider: location.provider,
      status: "error",
      slots: [],
    };
  } catch (err) {
    console.error(`Failed to scrape ${location.name}:`, err);

    return {
      id: location.id,
      name: location.name,
      provider: location.provider,
      status: "error",
      slots: [],
    };
  }
}

export async function getAvailability(
  date: string
): Promise<GetAvailabilityResponse> {
  const results = await Promise.all(
    locations.map((location) => scrapeLocation(location, date))
  );

  return {
    date,
    locations: results,
  };
}