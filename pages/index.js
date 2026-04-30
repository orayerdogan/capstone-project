import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import Flashcard from "../Components/Flashcard/Flashcard";
import { useState } from "react";
import Modal from "../Components/Modal/Modal";
import CreateFlashcard from "../Components/CreateFlashcard/CreateFlashcard";
import EditFlashcard from "../Components/EditFlashcard/EditFlashcard";

export default function HomePage() {
  const { data, error, mutate } = useSWR("/api/flashcards", fetcher);
  const [open, setOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  function handleAdd(newCard) {
    mutate([newCard, ...data], false);
  }
  function handleUpdate(updatedCard) {
    mutate(
      data.map((card) => (card._id === updatedCard._id ? updatedCard : card)),
      false
    );
  }
  if (error) return <p style={styles.status}>Fehler beim Laden</p>;
  if (!data) return <p style={styles.status}>Lade...</p>;

  return (
    <main style={styles.container}>
      <header>
        <h1 style={styles.title}>Anime Quiz 🎌</h1>
      </header>
      <button style={styles.addButton} onClick={() => setOpen(true)}>
        Add Flashcard
      </button>
      <section style={styles.list} aria-label="Anime Flashcards">
        {data.map((card) => (
          <Flashcard key={card._id} card={card} onEdit={setEditingCard} />
        ))}
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
  addButton: {
    marginBottom: "20px",
    padding: "12px 18px",
    borderRadius: "10px",
    border: "none",
    background: "#00f5ff",
    color: "#020617",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 0 10px #00f5ff",
  },
  editButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "rgba(0,0,0,0.6)",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
    padding: "4px 6px",
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
