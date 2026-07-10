import CourtAvailability from "./courtAvailabilityPage";
import styles from "./App.module.css";

export default function App() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.logoRow}>
          <svg
            className={styles.logoIcon}
            viewBox="0 0 28 20"
            fill="none"
            aria-hidden="true"
          >
            <rect x="1" y="1" width="26" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <line x1="14" y1="1" x2="14" y2="19" stroke="currentColor" strokeWidth="1.5" />
            <line x1="1" y1="7" x2="27" y2="7" stroke="currentColor" strokeWidth="1" />
            <line x1="1" y1="13" x2="27" y2="13" stroke="currentColor" strokeWidth="1" />
          </svg>
          <h1>Courtly</h1>
        </div>
        <p className={styles.tagline}>Find nearby tennis courts available to book</p>
      </header>
      <main>
        <CourtAvailability />
      </main>
      <footer className={styles.footer}>
        Court availability data sourced from City of Sydney and Centennial Parklands.
      </footer>
    </>
  );
}
