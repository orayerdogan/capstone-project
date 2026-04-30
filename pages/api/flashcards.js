import dbConnect from "../../db/dbConnect";
import Flashcard from "../../db/models/Flashcard";

const FALLBACK_IMAGE = "https://via.placeholder.com/300x160?text=No+Image";

const fallbackImages = {
  Naruto: "https://cdn.myanimelist.net/images/anime/13/17405.jpg",
  "One Piece": "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
  "Attack on Titan": "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
  "Demon Slayer": "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
  "Death Note": "https://cdn.myanimelist.net/images/anime/9/9453.jpg",
};

async function getImagesFromJikan(topic) {
  try {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(topic)}&limit=2`
    );

    if (!res.ok) {
      throw new Error(`Jikan HTTP Error: ${res.status}`);
    }

    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      throw new Error("No results");
    }

    return {
      front: data.data[0]?.images?.jpg?.image_url,
      back:
        data.data[1]?.images?.jpg?.image_url ||
        data.data[0]?.images?.jpg?.image_url,
    };
  } catch (err) {
    console.error(`Jikan failed for "${topic}":`, err.message);

    return {
      front: null,
      back: null,
    };
  }
}

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const flashcards = await Flashcard.find({});
      return res.status(200).json(flashcards);
    } catch (err) {
      console.error("GET error:", err);
      return res.status(500).json({ error: "Fehler beim Laden" });
    }
  }

  if (req.method === "POST") {
    try {
      const { question, answer, topic } = req.body;

      if (!question || !answer || !topic) {
        return res.status(400).json({ error: "Alle Felder sind erforderlich" });
      }

      const images = await getImagesFromJikan(topic);

      const imageFront =
        images.front || fallbackImages[topic] || FALLBACK_IMAGE;

      const imageBack =
        images.back || images.front || fallbackImages[topic] || FALLBACK_IMAGE;

      const newCard = await Flashcard.create({
        question,
        answer,
        topic,
        imageFront,
        imageBack,
      });

      return res.status(201).json(newCard);
    } catch (err) {
      console.error("POST error:", err);
      return res.status(500).json({ error: "Fehler beim Erstellen" });
    }
  }

  if (req.method === "PUT") {
    try {
      const { id, question, answer, topic } = req.body;

      if (!question || !answer || !topic) {
        return res.status(400).json({ error: "Alle Felder sind erforderlich" });
      }

      const updatedCard = await Flashcard.findByIdAndUpdate(
        id,
        { question, answer, topic },
        { returnDocument: "after" }
      );

      return res.status(200).json(updatedCard);
    } catch (err) {
      console.error("PUT error:", err);
      return res.status(500).json({ error: "Fehler beim Aktualisieren" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
