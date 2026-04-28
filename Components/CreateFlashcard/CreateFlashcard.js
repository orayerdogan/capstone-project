import { useState } from "react";

export default function CreateFlashcard({ onAdd }) {
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

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.question || !form.answer || !form.topic) {
      setError("Bitte alle Felder ausfüllen");
      return;
    }

    setError("");

    const res = await fetch("/api/flashcards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const newCard = await res.json();

    onAdd(newCard);

    setForm({
      question: "",
      answer: "",
      topic: "",
    });
  }

  return (
    <section style={{ marginBottom: "24px" }}>
      <h2>Create New Flashcard</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Question</label>
          <input
            name="question"
            value={form.question}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Answer</label>
          <input name="answer" value={form.answer} onChange={handleChange} />
        </div>

        <div>
          <label>Collection</label>
          <select name="topic" value={form.topic} onChange={handleChange}>
            <option value="">Please select a collection</option>
            {collections.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Add Flashcard</button>
      </form>
    </section>
  );
}
