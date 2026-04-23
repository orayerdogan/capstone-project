import mongoose from "mongoose";

const FlashcardSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Flashcard ||
  mongoose.model("Flashcard", FlashcardSchema);
