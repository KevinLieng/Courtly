import { cityCommunityScraper } from "./cityCommunityScraper";
import { parklandsScraper } from "./parklandsScraper";
import type { AvailabilityResponse } from "./slotTypes";

type Provider = "city-community" | "parklands";

type LocationConfig = {
  id: string; // your app's clean ID
  name: string; // display name
  provider: Provider;
  providerLocationId: number; // the ugly ID used in the booking URL
  lat: number;
  lng: number;
};

type LocationAvailability = {
  id: string;
  name: string;
  provider: Provider;
  distance?: number;
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
    lat:-33.8881445604106,
    lng: 151.20369882014919,
  },
  {
    id: "alexandria",
    name: "Alexandria",
    provider: "city-community",
    providerLocationId: 3,
    lat: -33.90042791823193, 
    lng: 151.19678674543417,
  },
  {
    id: "beaconsfield",
    name: "Beaconsfield",
    provider: "city-community",
    providerLocationId: 4,
    lat: -33.91140677806596, 
    lng: 151.19959643927322
  },
  {
    id: "glebe",
    name: "Glebe",
    provider: "city-community",
    providerLocationId: 5,
    lat: -33.88018036066187, 
    lng: 151.1842501460354,
  },
  {
    id: "rosebery",
    name: "Rosebery",
    provider: "city-community",
    providerLocationId: 6,
    lat: -33.91852131050488, 
    lng: 151.2040947445274,
  },
  {
    id: "centennial-park",
    name: "Centennial Park",
    provider: "parklands",
    providerLocationId: 55,
    lat: -33.896134186054155, 
    lng: 151.2227395249307,
  },
  {
    id: "moore-park",
    name: "Moore Park",
    provider: "parklands",
    providerLocationId: 72,
    lat: -33.89467781218229, 
    lng: 151.2199788257296,
  },
  
];

function getDistanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  const R = 6371;

  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;

  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

async function scrapeLocation(
  location: LocationConfig,
  date: string,
  userLocation?: { lat: number; lng: number }
): Promise<LocationAvailability> {
  try {
    if (location.provider === "city-community") {
      const data = await cityCommunityScraper(location.providerLocationId, date);

       const distance = userLocation
      ? getDistanceKm(userLocation, {
          lat: location.lat,
          lng: location.lng,
        })
      : undefined;
      return {
        id: location.id,
        name: location.name,
        provider: location.provider,
        status: data.status,
        slots: data.slots,
        distance
      };
    }

    if (location.provider === "parklands") {
      const data = await parklandsScraper(location.providerLocationId, date);
			const distance = userLocation
			? getDistanceKm(userLocation, {
					lat: location.lat,
					lng: location.lng,
			})
        : undefined;
      return {
        id: location.id,
        name: location.name,
        provider: location.provider,
        status: data.status,
        slots: data.slots,
				distance
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
  date: string,
  userLocation?: { lat: number; lng: number }
): Promise<GetAvailabilityResponse> {
  const results = await Promise.all(
    locations.map((location) => scrapeLocation(location, date, userLocation))
  );

const sortedResults = userLocation
    ? results.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
    : results;
  return {
    date,
    locations: sortedResults,
  };
}