import { useState } from "react";

export default function CreateFlashcard({ onAdd, onClose }) {
  const [form, setForm] = useState({
    question: "",
    answer: "",
    topic: "",
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
      setError("Please fill out all fields");
      return;
    }

    setError("");

    try {
      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        setError("Something went wrong. Please try again.");
        return;
      }

      const newCard = await response.json();

      onAdd(newCard);

      setForm({
        question: "",
        answer: "",
        topic: "",
      });

      onClose();
    } catch (error) {
      console.error("Frontend create error:", error);
    }
  }

  return (
    <section style={styles.container}>
      <h2>Create Flashcard</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="question">Question</label>

        <input
          id="question"
          name="question"
          value={form.question}
          onChange={handleChange}
          style={styles.input}
        />

        <label htmlFor="answer">Answer</label>

        <input
          id="answer"
          name="answer"
          value={form.answer}
          onChange={handleChange}
          style={styles.input}
        />

        <label htmlFor="topic">Collection</label>

        <select
          id="topic"
          name="topic"
          value={form.topic}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select a collection</option>

          {collections.map((collection) => (
            <option key={collection} value={collection}>
              {collection}
            </option>
          ))}
        </select>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.actions}>
          <button style={styles.saveButton} type="submit">
            Add
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
    boxSizing: "border-box",
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
    marginBottom: "12px",
  },
};
