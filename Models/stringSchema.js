import mongoose from "mongoose";

const stringSchema = new mongoose.Schema({
    id: {
        type: String, 
        required: true,
        unique: true,
    },
    value: {
        type: String, 
        required: true,
    },
    properties: {
        length: Number,
        is_palindrome: Boolean,
        unique_characters: Number,
        word_count: Number,
        sha256_hash: String,
        character_frequency_map: Object,
    },
    
}, { timestamps: true }); // Corrected timestamps);

export default mongoose.model("String", stringSchema);