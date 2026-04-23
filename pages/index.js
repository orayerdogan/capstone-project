import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import Flashcard from "../Components/Flashcard/Flashcard";

export default function Home() {
  const { data, error } = useSWR("/api/flashcards", fetcher);

  if (error) return <p style={styles.status}>Fehler beim Laden</p>;
  if (!data) return <p style={styles.status}>Lade...</p>;

  return (
    <main style={styles.container}>
      <header>
        <h1 style={styles.title}>Anime Flashcards 🎌</h1>
      </header>

      <section style={styles.list} aria-label="Anime Flashcards">
        {data.map((card) => (
          <Flashcard key={card._id} card={card} />
        ))}
      </section>
    </main>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "#020617",
    padding: "20px",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: "32px",
    color: "#00f5ff",
    marginBottom: "20px",
    textShadow: "0 0 10px #00f5ff",
  },
  list: {
    width: "100%",
    maxWidth: "500px",
    overflowY: "auto",
  },
  status: {
    color: "white",
    marginTop: "40px",
  },
};
