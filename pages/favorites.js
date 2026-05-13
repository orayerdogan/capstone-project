import useSWR from "swr";
import Link from "next/link";
import { useEffect, useState } from "react";

import Flashcard from "../Components/Flashcard/Flashcard";
import { fetcher } from "../lib/fetcher";

export default function FavoritesPage() {
  const { data, error } = useSWR("/api/flashcards", fetcher);

  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  useEffect(() => {
    const storedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    setBookmarkedIds(storedBookmarks);
  }, []);

  function handleBookmark(id) {
    let updatedBookmarks;

    if (bookmarkedIds.includes(id)) {
      updatedBookmarks = bookmarkedIds.filter(
        (bookmarkId) => bookmarkId !== id
      );
    } else {
      updatedBookmarks = [...bookmarkedIds, id];
    }

    setBookmarkedIds(updatedBookmarks);

    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
  }

  if (error) {
    return <p style={styles.status}>Failed to load favorites</p>;
  }

  if (!data) {
    return <p style={styles.status}>Loading...</p>;
  }

  const favoriteCards = data.filter((card) => bookmarkedIds.includes(card._id));

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>⭐ Favorite Flashcards</h1>

        <Link href="/" style={styles.backLink}>
          ← Back to Home
        </Link>
      </header>

      <section style={styles.list}>
        {favoriteCards.length === 0 ? (
          <p style={styles.emptyMessage}>No favorite flashcards yet ⭐</p>
        ) : (
          favoriteCards.map((card) => (
            <Flashcard
              key={card._id}
              card={card}
              onBookmark={handleBookmark}
              isBookmarked={bookmarkedIds.includes(card._id)}
              showActions={false}
            />
          ))
        )}
      </section>
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#020617",
    padding: "20px",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "24px",
  },

  title: {
    fontSize: "32px",
    color: "#ffd700",
    textShadow: "0 0 10px rgba(255,215,0,0.8)",
    marginBottom: "12px",
  },

  backLink: {
    color: "#00f5ff",
    textDecoration: "none",
    fontWeight: "bold",
    boxShadow: "0 0 10px rgba(0,245,255,0.4)",
    padding: "10px 16px",
    borderRadius: "10px",
    background: "#1e293b",
  },

  list: {
    width: "100%",
    maxWidth: "500px",
  },

  emptyMessage: {
    opacity: 0.7,
    fontSize: "18px",
    marginTop: "40px",
  },

  status: {
    color: "white",
    marginTop: "40px",
    textAlign: "center",
  },
};
