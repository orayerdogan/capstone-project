import { useState } from "react";

export default function EditFlashcard({ card, onClose, onUpdate }) {
  const [form, setForm] = useState({
    question: card.question,
    answer: card.answer,
    topic: card.topic,
  });

  const [error, setError] = useState("");

  const collections = [
    "Naruto",
    "One Piece",
    "Attack on Titan",
    "Demon Slayer",
    "Death Note",
  ];

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.question || !form.answer || !form.topic) {
      setError("Bitte alle Felder ausfüllen");
      return;
    }

    setError("");

    try {
      const response = await fetch("/api/flashcards", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: card._id,
          ...form,
        }),
      });

      if (!response.ok) {
        console.error("Update failed");
        return;
      }

      const updatedCard = await response.json();

      onUpdate(updatedCard);
      onClose();
    } catch (err) {
      console.error("Frontend update error:", err);
    }
  }

  return (
    <section style={styles.container}>
      <h2>Edit Flashcard</h2>

      <form onSubmit={handleSubmit}>
        <label>Question</label>
        <input
          style={styles.input}
          name="question"
          value={form.question}
          onChange={handleChange}
        />

        <label>Answer</label>
        <input
          style={styles.input}
          name="answer"
          value={form.answer}
          onChange={handleChange}
        />

        <label>Collection</label>
        <select
          style={styles.input}
          name="topic"
          value={form.topic}
          onChange={handleChange}
        >
          {collections.map((collection) => (
            <option key={collection} value={collection}>
              {collection}
            </option>
          ))}
        </select>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.actions}>
          <button style={styles.saveButton} type="submit">
            Save
          </button>

          <button style={styles.cancelButton} type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

const styles = {
  container: {
    color: "white",
  },

  input: {
    width: "100%",
    marginBottom: "12px",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "12px",
  },

  saveButton: {
    flex: 1,
    padding: "10px",
    background: "#00f5ff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  cancelButton: {
    flex: 1,
    padding: "10px",
    background: "#ff4d4d",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    color: "white",
  },

  error: {
    color: "#ff4d4d",
  },
};
