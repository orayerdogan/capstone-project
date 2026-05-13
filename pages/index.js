import useSWR from "swr";
import Link from "next/link";
import { fetcher } from "../lib/fetcher";
import Flashcard from "../Components/Flashcard/Flashcard";
import { useEffect, useState } from "react";
import Modal from "../Components/Modal/Modal";
import CreateFlashcard from "../Components/CreateFlashcard/CreateFlashcard";
import EditFlashcard from "../Components/EditFlashcard/EditFlashcard";
import DeleteModal from "@/Components/DeleteModal/DeleteModal";

export default function HomePage() {
  const { data, error, mutate } = useSWR("/api/flashcards", fetcher);

  const [open, setOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [message, setMessage] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("All");

  useEffect(() => {
    const storedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    setBookmarkedIds(storedBookmarks);
  }, []);

  function handleAdd(newCard) {
    mutate([newCard, ...data], false);
  }

  function handleEdit(card) {
    setEditingCard(card);
  }

  function handleUpdate(updatedCard) {
    mutate(
      data.map((card) => (card._id === updatedCard._id ? updatedCard : card)),
      false
    );
  }

  function handleDeleteClick(id) {
    setDeleteId(id);
  }

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

  async function confirmDelete() {
    try {
      const response = await fetch("/api/flashcards", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deleteId }),
      });

      if (!response.ok) {
        setMessage("Delete failed ❌");
        return;
      }

      mutate(
        data.filter((card) => card._id !== deleteId),
        false
      );

      setDeleteId(null);

      setMessage("Flashcard deleted ✅");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong ❌");
    }
  }

  if (error) return <p style={styles.status}>Failed to load</p>;
  if (!data) return <p style={styles.status}>Loading...</p>;

  const topics = ["All", ...new Set(data.map((card) => card.topic))];
  const filteredCards =
    selectedTopic === "All"
      ? data
      : data.filter((card) => card.topic === selectedTopic);

  return (
    <main style={styles.container}>
      <header>
        <h1 style={styles.title}>Anime Quiz 🎌</h1>
      </header>

      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.topBar}>
        <div style={styles.leftControls}>
          <button style={styles.addButton} onClick={() => setOpen(true)}>
            Add Flashcard
          </button>

          <select
            value={selectedTopic}
            onChange={(event) => setSelectedTopic(event.target.value)}
            style={styles.select}
          >
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        <Link href="/favorites" style={styles.favoriteLink}>
          ⭐ Favorites
        </Link>
      </div>

      <section style={styles.list}>
        {filteredCards.length === 0 ? (
          <p style={styles.emptyMessage}>No flashcards yet. Add one! 🎌</p>
        ) : (
          filteredCards.map((card) => (
            <Flashcard
              key={card._id}
              card={card}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onBookmark={handleBookmark}
              isBookmarked={bookmarkedIds.includes(card._id)}
            />
          ))
        )}
      </section>

      {open && (
        <Modal onClose={() => setOpen(false)}>
          <CreateFlashcard
            onAdd={(card) => {
              handleAdd(card);
              setOpen(false);
            }}
          />
        </Modal>
      )}

      {editingCard && (
        <Modal onClose={() => setEditingCard(null)}>
          <EditFlashcard
            card={editingCard}
            onClose={() => setEditingCard(null)}
            onUpdate={handleUpdate}
          />
        </Modal>
      )}

      {deleteId && (
        <DeleteModal
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
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

  title: {
    fontSize: "32px",
    color: "#00f5ff",
    marginBottom: "20px",
    textShadow: "0 0 10px #00f5ff",
  },

  topBar: {
    width: "100%",
    maxWidth: "500px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  leftControls: {
    display: "flex",
    gap: "10px",
  },

  addButton: {
    padding: "8px 12px",
    borderRadius: "10px",
    border: "none",
    background: "#00f5ff",
    color: "#020617",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 0 10px #00f5ff",
    fontSize: "14px",
  },

  favoriteLink: {
    padding: "12px 18px",
    borderRadius: "10px",
    background: "#1e293b",
    color: "#ffd700",
    textDecoration: "none",
    fontWeight: "bold",
    boxShadow: "0 0 10px rgba(255,215,0,0.5)",
  },

  select: {
    padding: "8px 12px",
    borderRadius: "10px",
    border: "none",
    background: "#1e293b",
    color: "#00f5ff",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 0 10px rgba(0,245,255,0.4)",
    fontSize: "14px",
  },

  list: {
    width: "100%",
    maxWidth: "500px",
    overflowY: "auto",
  },

  emptyMessage: {
    opacity: 0.7,
  },

  status: {
    color: "white",
    marginTop: "40px",
  },

  message: {
    marginBottom: "16px",
    color: "#00f5ff",
  },
};
