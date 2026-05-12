import { useState } from "react";

export default function Flashcard({
  card,
  onEdit,
  onDelete,
  onBookmark,
  isBookmarked,
}) {
  const [flipped, setFlipped] = useState(false);

  function handleFlip() {
    setFlipped((prev) => !prev);
  }

  const frontImage = card.imageFront || "/images/default.jpg";

  const backImage = card.imageBack || frontImage;

  return (
    <article style={styles.wrapper} onClick={handleFlip}>
      {/* BUTTONS */}
      <div style={styles.buttonGroup}>
        <button
          style={{
            ...styles.iconButton,
            background: isBookmarked
              ? "rgba(255,215,0,0.9)"
              : "rgba(0,0,0,0.6)",
          }}
          onClick={(event) => {
            event.stopPropagation();
            onBookmark(card._id);
          }}
        >
          {isBookmarked ? "⭐" : "☆"}
        </button>

        <button
          style={styles.iconButton}
          onClick={(event) => {
            event.stopPropagation();
            onEdit(card);
          }}
        >
          ✏️
        </button>

        <button
          style={{
            ...styles.iconButton,
            background: "rgba(255,0,0,0.7)",
          }}
          onClick={(event) => {
            event.stopPropagation();
            onDelete(card._id);
          }}
        >
          🗑
        </button>
      </div>

      {/* CARD */}
      <div
        style={{
          ...styles.card,
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT */}
        <div
          style={{
            ...styles.side,
            ...styles.front,
            backgroundImage: `linear-gradient(
              rgba(0,0,0,0.3),
              rgba(0,0,0,0.3)
            ), url(${frontImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div style={styles.overlay} />

          <p style={styles.topic}>{card.topic}</p>

          <h2 style={styles.question}>{card.question}</h2>
        </div>

        {/* BACK */}
        <div
          style={{
            ...styles.side,
            ...styles.back,
            backgroundImage: `linear-gradient(
              rgba(0,0,0,0.3),
              rgba(0,0,0,0.3)
            ), url(${backImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div style={styles.overlay} />

          <p style={styles.topic}>{card.topic}</p>

          <p style={styles.answer}>{card.answer}</p>
        </div>
      </div>
    </article>
  );
}

const styles = {
  wrapper: {
    perspective: "1000px",
    marginBottom: "16px",
    cursor: "pointer",
    position: "relative",
  },

  card: {
    position: "relative",
    width: "100%",
    height: "160px",
    transformStyle: "preserve-3d",
    transition: "transform 0.6s ease, box-shadow 0.3s",
  },

  side: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: "12px",
    padding: "16px",
    backfaceVisibility: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 0 15px rgba(0,0,0,0.5)",
    color: "white",
  },

  front: {},

  back: {
    transform: "rotateY(180deg)",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    borderRadius: "12px",
  },

  topic: {
    fontSize: "12px",
    opacity: 0.7,
    marginBottom: "8px",
    zIndex: 1,
  },

  question: {
    fontSize: "18px",
    color: "#00f5ff",
    fontWeight: "bold",
    textAlign: "center",
    zIndex: 1,
  },

  answer: {
    fontSize: "16px",
    color: "#e879f9",
    textAlign: "center",
    zIndex: 1,
  },

  buttonGroup: {
    position: "absolute",
    top: "10px",
    right: "10px",
    display: "flex",
    gap: "8px",
    zIndex: 2,
  },

  iconButton: {
    border: "none",
    borderRadius: "6px",
    background: "rgba(0,0,0,0.6)",
    color: "white",
    cursor: "pointer",
    padding: "4px 8px",
    fontSize: "16px",
  },
};
