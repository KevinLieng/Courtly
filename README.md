# Courtly

Courtly is a Sydney tennis court availability website that helps players quickly check open court times across multiple locations.

Instead of manually opening each booking page, Courtly shows available tennis court slots in one simple view, making it easier to find a court and play.

## Features

- View available tennis court slots by location
- Select a booking date
- See availability across multiple Sydney locations
- Simple responsive layout for desktop and mobile
- Backend scraper fetches live availability data
- React frontend displays court times in an easy-to-read grid

## Locations

Courtly currently supports the following Sydney locations:

- Surry Hills
- Alexandria
- Beaconsfield
- Glebe
- Rosebery

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- CSS

### Backend

- Node.js
- Express
- TypeScript
- Axios
- Cheerio

How It Works

Courtly sends a request to the backend with a selected location and date.

The backend then fetches the relevant booking page, parses the available court reservation links, and returns a clean JSON list of available time slots.

The frontend displays those slots in a simple table so users can quickly see when and where courts are available.

Disclaimer

Courtly is an independent project and is not affiliated with any tennis centre, council, or booking provider.

Availability information is fetched from public booking pages and may change. Always confirm the final booking details on the official booking website.

Author

Built by Kevin.
