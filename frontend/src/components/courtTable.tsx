import { useAvailability } from "../hooks/useAvailability";

export default function CourtTable() {
  const { slots, loading } = useAvailability(2, "2026-06-11");
    console.log({ slots, loading });
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Court</th>
          <th>Time</th>
          <th>Available</th>
        </tr>
      </thead>
      <tbody>
        {slots.map((slot, index) => (
          <tr key={index}>
            <td>{slot.court}</td>
            <td>{slot.time}</td>
            <td>{slot.available ? "✅" : "❌"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}   