import mongoose from "mongoose";

const stringSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    value: { type: String, required: true, unique: true },
    properties: {
      length: { type: Number, required: true },
      is_palindrome: { type: Boolean, required: true },
      unique_characters: { type: Number, required: true },
      word_count: { type: Number, required: true },
      sha256_hash: { type: String, required: true },
      character_frequency_map: { type: Object, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model("String", stringSchema);
