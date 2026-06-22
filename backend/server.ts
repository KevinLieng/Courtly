import express, { Request, Response } from "express";
import cors from "cors";
import { getAvailability } from "./scrapers/getAvailability";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/api/availability", async (req: Request, res: Response) => {
  try {
    console.log("URL:", req.url);
    console.log("QUERY:", req.query);

    const date = String(req.query.date);

    if (!date || date === "undefined") {
      return res.status(400).json({
        error: "Missing date",
      });
    }

    const data = await getAvailability(date);

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