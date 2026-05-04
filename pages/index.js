import useSWR from "swr";
import { fetcher } from "../lib/fetcher";
import Flashcard from "../Components/Flashcard/Flashcard";
import { useState } from "react";
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
  async function confirmDelete() {
    await fetch("/api/flashcards", {
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

    setTimeout(() => setMessage(""), 2000);
  }
  if (error) return <p style={styles.status}>Fehler beim Laden</p>;
  if (!data) return <p style={styles.status}>Lade...</p>;

  return (
    <main style={styles.container}>
      <header>
        <h1 style={styles.title}>Anime Quiz 🎌</h1>
      </header>
      {message && <p style={styles.message}>{message}</p>}
      <button style={styles.addButton} onClick={() => setOpen(true)}>
        Add Flashcard
      </button>
      <section style={styles.list}>
        {data.length === 0 ? (
          <p>No flashcards yet. Add one! 🎌</p>
        ) : (
          data.map((card) => (
            <Flashcard
              key={card._id}
              card={card}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
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
