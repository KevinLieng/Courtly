import express, { Request, Response } from "express";
import cors from "cors";
import { getAvailability } from "./scrapers/cityCommunityScraper";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/api/availability", async (req: Request, res: Response) => {
  try {

    console.log("URL:", req.url);
    console.log("QUERY:", req.query);

    const location = Number(req.query.location);
    const date = String(req.query.date);

    if (!location || !date) {
      return res.status(400).json({
        error: "Missing location or date",
      });
    }

    const data = await getAvailability(location, date);

    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Failed to fetch availability",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});