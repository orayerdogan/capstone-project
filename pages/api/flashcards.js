import dbConnect from "../../db/dbConnect";
import Flashcard from "../../db/models/Flashcard";

const topicCache = {};
const pendingRequests = {};

async function getImagesFromJikan(topic) {
  if (topicCache[topic]) {
    return topicCache[topic];
  }

  if (pendingRequests[topic]) {
    return pendingRequests[topic];
  }

  const request = fetch(`https://api.jikan.moe/v4/anime?q=${topic}&limit=2`)
    .then((res) => res.json())
    .then((data) => {
      const images = {
        front: data?.data?.[0]?.images?.jpg?.image_url || null,
        back: data?.data?.[1]?.images?.jpg?.image_url || null,
      };

      topicCache[topic] = images;
      delete pendingRequests[topic];

      return images;
    })
    .catch((err) => {
      console.error(`Jikan error for topic "${topic}":`, err);

      delete pendingRequests[topic];

      return { front: null, back: null };
    });
  pendingRequests[topic] = request;

  return request;
}

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const flashcards = await Flashcard.find({});

      const flashcardsWithImages = await Promise.all(
        flashcards.map(async (card) => {
          const images = await getImagesFromJikan(card.topic);

          return {
            ...card.toObject(),
            imageFront: images.front,
            imageBack: images.back || images.front,
          };
        })
      );

      return res.status(200).json(flashcardsWithImages);
    } catch (err) {
      console.error("API error:", err);

      return res
        .status(500)
        .json({ error: "Fehler beim Laden der Flashcards" });
    }
  }

  if (req.method === "POST") {
    try {
      const { question, answer, topic } = req.body;

      if (!question || !answer || !topic) {
        return res.status(400).json({
          error: "Alle Felder sind erforderlich",
        });
      }

      const newCard = await Flashcard.create({
        question,
        answer,
        topic,
      });

      return res.status(201).json(newCard);
    } catch (err) {
      console.error("Create error:", err);

      return res.status(500).json({ error: "Fehler beim Erstellen" });
    }
  }
  return res.status(405).json({
    message: "Method not allowed",
  });
}
