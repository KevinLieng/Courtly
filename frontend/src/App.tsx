import CourtAvailability from "./courtAvailabilityPage";
import styles from "./App.module.css";

export default function App() {
  return (
    <>
      <header className={styles.header}>
        <h1>Courtly</h1>
        <p className={styles.tagline}>Find nearby tennis courts available to book</p>
      </header>
      <main>
        <CourtAvailability />
      </main>
    </>
  );
}
