import { cityCommunityScraper } from "./cityCommunityScraper";
import { parklandsScraper } from "./parklandsScraper";
import { tennisVenuesScraper } from "./tennisVenuesScraper";
import type { AvailabilityResponse } from "./slotTypes";

type Provider = "city-community" | "parklands" | "tennis-venues";

type LocationConfig = (
  | { provider: "city-community" | "parklands"; providerLocationId: number }
  | {
      provider: "tennis-venues";
      slug: string;
      venueId?: string;
      isTennisCourt?: (courtName: string) => boolean;
      maxAdvanceDays?: number;
    }
) & {
  id: string; // your app's clean ID
  name: string; // display name
  lat: number;
  lng: number;
  mapsUrl: string;
};

type LocationAvailability = {
  id: string;
  name: string;
  provider: Provider;
  distance?: number;
  lat: number;
  lng: number;
  mapsUrl: string;
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
    lat: -33.8881445604106,
    lng: 151.20369882014919,
    mapsUrl: "https://maps.app.goo.gl/WVXPzwutn6gHNEuG9",
  },
  {
    id: "alexandria",
    name: "Alexandria",
    provider: "city-community",
    providerLocationId: 3,
    lat: -33.90042791823193,
    lng: 151.19678674543417,
    mapsUrl: "https://maps.app.goo.gl/UwtsPCfzCfi88t4XA",
  },
  {
    id: "beaconsfield",
    name: "Beaconsfield",
    provider: "city-community",
    providerLocationId: 4,
    lat: -33.91140677806596,
    lng: 151.19959643927322,
    mapsUrl: "https://maps.app.goo.gl/PuyoHhSnD2vkfSaY6",
  },
  {
    id: "glebe",
    name: "Glebe",
    provider: "city-community",
    providerLocationId: 5,
    lat: -33.88018036066187,
    lng: 151.1842501460354,
    mapsUrl: "https://maps.app.goo.gl/aCbjhrUCrT4wyC9XA",
  },
  {
    id: "rosebery",
    name: "Rosebery",
    provider: "city-community",
    providerLocationId: 6,
    lat: -33.91852131050488,
    lng: 151.2040947445274,
    mapsUrl: "https://maps.app.goo.gl/tEdEU5EcPfMzi9Xu8",
  },
  {
    id: "centennial-park",
    name: "Centennial Park",
    provider: "parklands",
    providerLocationId: 55,
    lat: -33.896134186054155,
    lng: 151.2227395249307,
    mapsUrl: "https://maps.app.goo.gl/HCT4skBKwMvj4kq37",
  },
  {
    id: "moore-park",
    name: "Moore Park",
    provider: "parklands",
    providerLocationId: 72,
    lat: -33.89467781218229,
    lng: 151.2199788257296,
    mapsUrl: "https://maps.app.goo.gl/sT3ixhX1MCTr4UYL8",
  },
  {
    id: "eastside-tennis-centre",
    name: "Eastside",
    provider: "tennis-venues",
    slug: "eastside-tennis-centre",
    lat: -33.922246,
    lng: 151.222015,
    mapsUrl: "https://maps.app.goo.gl/HHTVdLaMAT17fykH7",
  },
  {
    id: "panania-tennis-centre",
    name: "Panania",
    provider: "tennis-venues",
    slug: "panania-tennis-centre",
    lat: -33.953464,
    lng: 150.988624,
    mapsUrl: "https://maps.app.goo.gl/bh2R1axw2yUhT9YS6",
  },
  {
    id: "moxon-sports-club",
    name: "Moxon",
    provider: "tennis-venues",
    slug: "moxon-sports-club",
    lat: -33.938536,
    lng: 151.043343,
    mapsUrl: "https://maps.app.goo.gl/wD8Jqd4NbEpX2wJ26",
  },
  {
    id: "smith-park-tc",
    name: "Smith Park",
    provider: "tennis-venues",
    slug: "smith-park-tc",
    lat: -33.959243,
    lng: 150.990047,
    mapsUrl: "https://maps.app.goo.gl/aEQcEmZjpKU5ryjG8",
  },
  {
    id: "bexley-tennis-courts",
    name: "Bexley",
    provider: "tennis-venues",
    slug: "bexley-tennis-courts",
    maxAdvanceDays: 30,
    lat: -33.944678,
    lng: 151.121344,
    mapsUrl: "https://maps.app.goo.gl/rmUoVkFgV3B2GVBZ9",
  },
  {
    id: "rockdale-tc",
    name: "Rockdale",
    provider: "tennis-venues",
    slug: "rockdale-tc",
    maxAdvanceDays: 30,
    lat: -33.956957,
    lng: 151.141519,
    mapsUrl: "https://maps.app.goo.gl/vNjGBiWXwCptLVX58",
  },
  {
    id: "meadowbank-park-tc",
    name: "Meadowbank Park",
    provider: "tennis-venues",
    slug: "meadowbank-park-tc",
    maxAdvanceDays: 30,
    lat: -33.815511,
    lng: 151.083520,
    mapsUrl: "https://maps.app.goo.gl/YDB3sQdMzwu8aCpu6",
  },
  {
    id: "ryde-tennis-centre",
    name: "Ryde",
    provider: "tennis-venues",
    slug: "ryde-tennis-centre",
    maxAdvanceDays: 30,
    lat: -33.822303,
    lng: 151.118044,
    mapsUrl: "https://maps.app.goo.gl/bjHiioUuodTj1PBU9",
  },
  {
    id: "artarmon-tennis",
    name: "Artarmon",
    provider: "tennis-venues",
    slug: "artarmon-tennis",
    maxAdvanceDays: 30,
    lat: -33.811699,
    lng: 151.187463,
    mapsUrl: "https://maps.app.goo.gl/8NPPQYqnnUrPg1pM8",
  },
  {
    id: "gosford-tennis-club",
    name: "Gosford",
    provider: "tennis-venues",
    slug: "gosford-tennis-club",
    maxAdvanceDays: 30,
    lat: -33.419630,
    lng: 151.331700,
    mapsUrl: "https://maps.app.goo.gl/pSs12twoo3yXzAcU9",
  },
  {
    id: "narraweena-tennis-club",
    name: "Narraweena",
    provider: "tennis-venues",
    slug: "narraweena-tennis-club",
    maxAdvanceDays: 30,
    lat: -33.750837,
    lng: 151.277553,
    mapsUrl: "https://maps.app.goo.gl/4LVbytdiDwNibsF89",
  },
  {
    id: "wakehurst-tc",
    name: "Wakehurst",
    provider: "tennis-venues",
    slug: "wakehurst-tc",
    maxAdvanceDays: 30,
    lat: -33.781222,
    lng: 151.244465,
    mapsUrl: "https://maps.app.goo.gl/o8snYW7QfL1iD8YQ7",
  },
  {
    id: "koobilya-st-tennis-court",
    name: "Koobilya St",
    provider: "tennis-venues",
    slug: "koobilya-st-tennis-court",
    maxAdvanceDays: 30,
    lat: -33.790455,
    lng: 151.245502,
    mapsUrl: "https://maps.app.goo.gl/uZi3Afoqg4nFGgSr6",
  },
  {
    id: "willis-park-tennis",
    name: "Willoughby",
    provider: "tennis-venues",
    slug: "willis-park-tennis",
    maxAdvanceDays: 30,
    lat: -33.786902,
    lng: 151.202265,
    mapsUrl: "https://maps.app.goo.gl/4sVuyvV6FizyCHpJ6",
  },
  {
    id: "five-dock-tc",
    name: "Five Dock Park",
    provider: "tennis-venues",
    slug: "five-dock-tc",
    maxAdvanceDays: 30,
    lat: -33.865561,
    lng: 151.135312,
    mapsUrl: "https://maps.app.goo.gl/frZcXaV4TGcW3LPeA",
  },
  {
    id: "croker-park-tc",
    name: "Croker Park",
    provider: "tennis-venues",
    slug: "Croker-park-tc", // case-sensitive — lowercase slug 404s on this venue
    lat: -33.873359,
    lng: 151.128685,
    mapsUrl: "https://maps.app.goo.gl/cqSdoVLLw7x4yEMZ6",
  },
  {
    id: "southend-tc",
    name: "Southend",
    provider: "tennis-venues",
    slug: "southend-tc",
    // Default /^court/i filter already excludes "7A/7B/7C/7D Pickleball" —
    // verified live, no override needed.
    lat: -33.897912,
    lng: 151.087091,
    mapsUrl: "https://maps.app.goo.gl/rWaH59pvWod37X2YA",
  },
  {
    id: "ken-rosewall-tennis-centre",
    name: "Ken Rosewall",
    provider: "tennis-venues",
    slug: "ken-rosewall-tennis-centre",
    lat: -33.969372,
    lng: 151.061977,
    mapsUrl: "https://maps.app.goo.gl/bGPG9pVFKTiuY9jC7",
  },
  {
    id: "parkside-tennis-courts-kogarah",
    name: "Parkside",
    provider: "tennis-venues",
    slug: "parkside-tennis-courts-kogarah",
    lat: -33.980951,
    lng: 151.120293,
    mapsUrl: "https://maps.app.goo.gl/rM7VKfpufrhwXD6x7",
  },
  {
    id: "trinity-tennis-centre",
    name: "Trinity",
    provider: "tennis-venues",
    slug: "trinity-tennis-centre",
    lat: -33.904130,
    lng: 151.118758,
    mapsUrl: "https://maps.app.goo.gl/dnzLe3cn7cnbBMm5A",
  },
  {
    id: "sylvania-waters-tc",
    name: "Sylvania Waters",
    provider: "tennis-venues",
    slug: "sylvania-waters-tc",
    lat: -34.025257,
    lng: 151.109751,
    mapsUrl: "https://maps.app.goo.gl/tS1MS4MbSyDL6ryD6",
  },
  {
    id: "caringbah-tennis",
    name: "Caringbah",
    provider: "tennis-venues",
    slug: "caringbah-tennis",
    lat: -34.035858,
    lng: 151.130645,
    mapsUrl: "https://maps.app.goo.gl/swZ4ZDVsLzPekyF86",
  },
  {
    id: "sydney-boys-high-school",
    name: "Sydney Boys",
    provider: "tennis-venues",
    slug: "sydney-boys-high-school",
    lat: -33.892475,
    lng: 151.218498,
    mapsUrl: "https://maps.app.goo.gl/9xDAhBjkLqPo7aon9",
  },
  {
    id: "cooper-park-tc",
    name: "Cooper Park",
    provider: "tennis-venues",
    slug: "cooper-park-tc",
    lat: -33.886821,
    lng: 151.251188,
    mapsUrl: "https://maps.app.goo.gl/mYAMCWiKFaJ4QR778",
  },
  {
    id: "haberfield-tc",
    name: "Haberfield",
    provider: "tennis-venues",
    slug: "haberfield-tc",
    maxAdvanceDays: 7,
    // Court headers here are "Tennis Court 1 (...)", not "Court 1 (...)" —
    // the default /^court/i filter matches none of them. Verified: with
    // the default this venue silently showed zero availability.
    isTennisCourt: (name) => /court/i.test(name),
    lat: -33.880610,
    lng: 151.144195,
    mapsUrl: "https://maps.app.goo.gl/nw34eKG681BJfeqj9",
  },
  {
    id: "bondi-tc",
    name: "Bondi Beach",
    provider: "tennis-venues",
    slug: "bondi-tc",
    lat: -33.884344,
    lng: 151.270614,
    mapsUrl: "https://maps.app.goo.gl/4z1xR2QbPqFFp3fQ8",
  },
  {
    id: "latham-park-tc",
    name: "Latham Park",
    provider: "tennis-venues",
    slug: "latham-park-tc",
    lat: -33.934916,
    lng: 151.248872,
    mapsUrl: "https://maps.app.goo.gl/r2BmWUvjpkEycQDx7",
  },
  {
    id: "vince-barclay-coaching-academy",
    name: "Vince Barclay",
    provider: "tennis-venues",
    slug: "vince-barclay-coaching-academy",
    lat: -33.767317,
    lng: 151.115635,
    mapsUrl: "https://maps.app.goo.gl/hsM4jv7NdwF8VZNG6",
  },
  {
    id: "centre-court-tennis",
    name: "Coleman Park",
    provider: "tennis-venues",
    slug: "centre-court-tennis",
    lat: -33.916050,
    lng: 150.975868,
    mapsUrl: "https://maps.app.goo.gl/73QP7yxmaTuX2BLq5",
  },
  {
    id: "snape-park-tc",
    name: "Snape Park",
    provider: "tennis-venues",
    slug: "snape-park-tc",
    lat: -33.934579,
    lng: 151.235067,
    mapsUrl: "https://maps.app.goo.gl/VZgvEQbJLwFB6wYFA",
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
        lat: location.lat,
        lng: location.lng,
        mapsUrl: location.mapsUrl,
        status: data.status,
        slots: data.slots,
        distance,
      };
    }

    if (location.provider === "parklands") {
      const data = await parklandsScraper(location.providerLocationId, date);
      const distance = userLocation
        ? getDistanceKm(userLocation, { lat: location.lat, lng: location.lng })
        : undefined;
      return {
        id: location.id,
        name: location.name,
        provider: location.provider,
        lat: location.lat,
        lng: location.lng,
        mapsUrl: location.mapsUrl,
        status: data.status,
        slots: data.slots,
        distance,
      };
    }

    if (location.provider === "tennis-venues") {
      const data = await tennisVenuesScraper(
        {
          slug: location.slug,
          venueId: location.venueId,
          isTennisCourt: location.isTennisCourt,
          maxAdvanceDays: location.maxAdvanceDays,
        },
        date
      );
      const distance = userLocation
        ? getDistanceKm(userLocation, { lat: location.lat, lng: location.lng })
        : undefined;
      return {
        id: location.id,
        name: location.name,
        provider: location.provider,
        lat: location.lat,
        lng: location.lng,
        mapsUrl: location.mapsUrl,
        status: data.status,
        slots: data.slots,
        distance,
      };
    }

    return {
      id: location.id,
      name: location.name,
      provider: location.provider,
      lat: location.lat,
      lng: location.lng,
      mapsUrl: location.mapsUrl,
      status: "error",
      slots: [],
    };
  } catch (err) {
    console.error(`Failed to scrape ${location.name}:`, err);

    return {
      id: location.id,
      name: location.name,
      lat: location.lat,
      lng: location.lng,
      mapsUrl: location.mapsUrl,
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