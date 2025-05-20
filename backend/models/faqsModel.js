import mongoose from "mongoose";

const faqsSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Faqs", faqsSchema);
