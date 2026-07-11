import CourtAvailability from "./courtAvailabilityPage";
import styles from "./App.module.css";

export default function App() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.logoRow}>
          {/* Top-down tennis court */}
          <svg
            className={styles.logoIcon}
            viewBox="0 0 36 24"
            fill="none"
            aria-hidden="true"
          >
            <rect x="1" y="1" width="34" height="22" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <line x1="7" y1="1" x2="7" y2="23" stroke="currentColor" strokeWidth="0.75" />
            <line x1="29" y1="1" x2="29" y2="23" stroke="currentColor" strokeWidth="0.75" />
            <line x1="1" y1="12" x2="35" y2="12" stroke="currentColor" strokeWidth="2" />
            <line x1="7" y1="7" x2="29" y2="7" stroke="currentColor" strokeWidth="0.75" />
            <line x1="7" y1="17" x2="29" y2="17" stroke="currentColor" strokeWidth="0.75" />
            <line x1="18" y1="7" x2="18" y2="17" stroke="currentColor" strokeWidth="0.75" />
          </svg>
          <h1 className={styles.wordmark}>Courtly</h1>
        </div>
        <p className={styles.tagline}>Find an available tennis court across Sydney</p>
      </header>
      <main>
        <CourtAvailability />
      </main>
      <footer className={styles.footer}>
        Court availability sourced from City of Sydney, Centennial Parklands & TennisVenues.com.au.
      </footer>
    </>
  );
}
