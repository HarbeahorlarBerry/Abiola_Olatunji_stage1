import stringSchema from "../../Models/stringSchema.js";
import { analyseString } from "../../utils/stringUtils.js";

// ✅ POST /strings
export const createString = async (req, res) => {
  try {
    const { value } = req.body;

    if (!value)
      return res.status(422).json({ error: "Missing 'value' field" });
    if (typeof value !== "string")
      return res.status(422).json({ error: "'value' must be a string" });

    const properties = analyseString(value);
    const exists = await stringSchema.findOne({
      "properties.sha256_hash": properties.sha256_hash,
    });
    if (exists)
      return res.status(409).json({ error: "String already exists" });

    const newString = await stringSchema.create({
      id: properties.sha256_hash,
      value,
      properties,
    });

    res.status(201).json({
      value,
      length: properties.length,
      is_palindrome: properties.is_palindrome,
      unique_characters: properties.unique_characters,
      word_count: properties.word_count,
      sha256_hash: properties.sha256_hash,
      character_frequency_map: properties.character_frequency_map,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ GET /strings/:string_value
export const getString = async (req, res) => {
  const { string_value } = req.params;
  const result = await stringSchema.findOne({ value: string_value });
  if (!result) return res.status(404).json({ message: "String not found" });
  res.json(result);
};

// ✅ GET /strings
export const getAllString = async (req, res) => {
  const filter = {};
  const {
    is_palindrome,
    min_length,
    max_length,
    word_count,
    contains_character,
  } = req.query;

  if (is_palindrome)
    filter["properties.is_palindrome"] = is_palindrome === "true";
  if (min_length || max_length) {
    filter["properties.length"] = {};
    if (min_length) filter["properties.length"].$gte = Number(min_length);
    if (max_length) filter["properties.length"].$lte = Number(max_length);
  }
  if (word_count) filter["properties.word_count"] = Number(word_count);
  if (contains_character)
    filter.value = { $regex: contains_character, $options: "i" };

  const data = await stringSchema.find(filter);
  res.json({ data, count: data.length, filters_applied: req.query });
};

// ✅ DELETE /strings/:string_value
export const deleteString = async (req, res) => {
  const { string_value } = req.params;
  const deleted = await stringSchema.findOneAndDelete({ value: string_value });
  if (!deleted) return res.status(404).json({ message: "String not found" });
  res.status(204).send();
};

// ✅ GET /strings/filter-by-natural-language
export const filterByNaturalLanguage = async (req, res) => {
  try {
    const q = req.query.q?.toLowerCase() || "";
    const filter = {};

    // 🔹 Palindromes
    if (q.includes("palindrome")) {
      filter["properties.is_palindrome"] = true;
    }

    // 🔹 Longer than X
    else if (q.includes("longer than")) {
      const num = parseInt(q.match(/\d+/)?.[0]);
      if (!isNaN(num)) filter["properties.length"] = { $gt: num };
    }

    // 🔹 Shorter than X
    else if (q.includes("shorter than")) {
      const num = parseInt(q.match(/\d+/)?.[0]);
      if (!isNaN(num)) filter["properties.length"] = { $lt: num };
    }

    // 🔹 Contains word or character
    else if (q.includes("containing") || q.includes("includes")) {
      const match = q.split(/containing|includes/)[1]?.trim().replace(/['"]/g, "");
      if (match) filter.value = { $regex: match, $options: "i" };
    }

    // 🔹 Word count
    else if (q.includes("word")) {
      const num = parseInt(q.match(/\d+/)?.[0]);
      if (!isNaN(num)) filter["properties.word_count"] = num;
    }

    // ✅ Fetch matching results
    const results = await stringSchema.find(filter);

    res.status(200).json({
      query: q,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("❌ Error filtering natural language:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
