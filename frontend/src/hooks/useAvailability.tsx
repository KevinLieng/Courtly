  import { useEffect, useState } from "react";
  import { getAvailability, type Slot } from "../api/courts";

  export function useAvailability(location: number, date: string) {
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (!location || !date) return;

      setLoading(true);

      getAvailability(location, date)
        .then(setSlots)
        .finally(() => setLoading(false));
    }, [location, date]);

    return { slots, loading };
  }