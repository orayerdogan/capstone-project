export default function Flashcard({ card }) {
  return (
    <article style={styles.card}>
      <p style={styles.topic}>{card.topic}</p>
      <h2 style={styles.question}>{card.question}</h2>
      <p style={styles.answer}>{card.answer}</p>
    </article>
  );
}

const styles = {
  card: {
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    padding: "16px",
    borderRadius: "12px",
    marginBottom: "16px",
    boxShadow: "0 0 15px rgba(0,0,0,0.5)",
  },
  topic: {
    fontSize: "12px",
    opacity: 0.6,
    color: "white",
  },
  question: {
    fontSize: "18px",
    color: "#00f5ff",
    fontWeight: "bold",
    margin: "8px 0",
  },
  answer: {
    fontSize: "14px",
    color: "#e879f9",
  },
};
