import { useState } from "react";

export default function Flashcard({ card }) {
  const [flipped, setFlipped] = useState(false);

  function handleFlip() {
    setFlipped((prev) => !prev);
  }

  const frontImage = card.imageFront || "/images/default.jpg";
  const backImage = card.imageBack || frontImage;

  return (
    <article style={styles.wrapper} onClick={handleFlip}>
      <div
        style={{
          ...styles.card,
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT (Question) */}
        <div
          style={{
            ...styles.side,
            ...styles.front,
            backgroundImage: `url(${frontImage})`,
          }}
        >
          <p style={styles.topic}>{card.topic}</p>
          <h2 style={styles.question}>{card.question}</h2>
        </div>

        {/* BACK (Answer) */}
        <div
          style={{
            ...styles.side,
            ...styles.back,
            backgroundImage: `url(${backImage})`,
          }}
        >
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
  },
  card: {
    width: "100%",
    height: "160px",
    position: "relative",
    transformStyle: "preserve-3d",
    transition: "transform 0.6s, box-shadow 0.3s",
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

    //Background Image
    backgroundSize: "cover",
    backgroundPosition: "center",

    //Overlay für Lesbarkeit
    backgroundBlendMode: "darken",
    backgroundColor: "rgba(0,0,0,0.6)",

    color: "white",
  },
  front: {},
  back: {
    transform: "rotateY(180deg)",
  },
  topic: {
    fontSize: "12px",
    opacity: 0.7,
    marginBottom: "8px",
  },
  question: {
    fontSize: "18px",
    color: "#00f5ff",
    fontWeight: "bold",
    textAlign: "center",
  },
  answer: {
    fontSize: "16px",
    color: "#e879f9",
    textAlign: "center",
  },
};
