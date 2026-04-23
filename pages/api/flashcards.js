import dbConnect from "../../db/dbConnect";
import Flashcard from "../../db/models/Flashcard";

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "GET") {
    try {
      const flashcards = await Flashcard.find({});
      return res.status(200).json(flashcards);
    } catch (error) {
      return res.status(500).json({
        error: "error can not load Flashcards",
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
