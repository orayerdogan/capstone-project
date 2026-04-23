import dbConnect from "../../db/dbConnect";
import Flashcard from "../../db/models/Flashcard";

const topicCache = {};

async function getImagesFromJikan(topic) {
  if (topicCache[topic]) {
    return topicCache[topic];
  }

  try {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${topic}&limit=2`
    );
    const data = await res.json();

    const images = {
      front: data.data[0]?.images.jpg.image_url || null,
      back: data.data[1]?.images.jpg.image_url || null,
    };

    topicCache[topic] = images; // 🔥 speichern
    return images;
  } catch {
    return { front: null, back: null };
  }
}

export default async function handler(req, res) {
  await dbConnect();

  try {
    const flashcards = await Flashcard.find({});

    const flashcardsWithImages = await Promise.all(
      flashcards.map(async (card) => {
        const images = await getImagesFromJikan(card.topic);

        return {
          ...card.toObject(),
          imageFront: images.front,
          imageBack: images.back || images.front, // fallback
        };
      })
    );

    res.status(200).json(flashcardsWithImages);
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Laden" });
  }
}
