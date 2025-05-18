import mongoose from "mongoose";

const faqsSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    unique: true,
  },
  answer: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.ObjectId,
    ref: "Category",
    required: true,
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true,
  },
});

export default mongoose.model("Faqs", faqsSchema);
