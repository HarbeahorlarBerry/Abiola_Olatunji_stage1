import express from "express";
import crypto from "crypto";
import stringSchema from "../Models/stringSchema.js"; // ✅ corrected import path

const router = express.Router();

// ✅ POST /strings
router.post("/", async (req, res) => {
  try {
    const { value } = req.body;

    if (!value) return res.status(422).json({ error: "Missing 'value' field" });
    if (typeof value !== "string") return res.status(422).json({ error: "'value' must be a string" });

    const existing = await stringSchema.findOne({ value });
    if (existing) return res.status(409).json({ error: "String already exists" });

    const lower = value.toLowerCase();
    const is_palindrome = lower === lower.split("").reverse().join("");
    const length = value.length;
    const sha256 = crypto.createHash("sha256").update(value).digest("hex");

    const newString = await stringSchema.create({
      value,
      length,
      is_palindrome,
      sha256,
    });

    return res.status(201).json({
      value,
      length,
      is_palindrome,
      sha256,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ GET /strings/filter-by-natural-language
router.get("/filter-by-natural-language", async (req, res) => {
  try {
    const q = req.query.q?.toLowerCase() || "";
    let filter = {};

    if (q.includes("palindrome")) filter.is_palindrome = true;
    else if (q.includes("longer than")) {
      const num = parseInt(q.match(/\d+/)?.[0]);
      if (!isNaN(num)) filter.length = { $gt: num };
    } else if (q.includes("shorter than")) {
      const num = parseInt(q.match(/\d+/)?.[0]);
      if (!isNaN(num)) filter.length = { $lt: num };
    } else if (q.includes("containing")) {
      const word = q.split("containing")[1]?.trim().replace(/['"]/g, "");
      if (word) filter.value = { $regex: word, $options: "i" };
    }

    const results = await stringSchema.find(filter);
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ GET /strings
router.get("/", async (req, res) => {
  const strings = await stringSchema.find();
  res.status(200).json(strings);
});

// ✅ GET /strings/:string_value
router.get("/:string_value", async (req, res) => {
  const str = await stringSchema.findOne({ value: req.params.string_value });
  if (!str) return res.status(404).json({ error: "String not found" });
  res.status(200).json(str);
});

// ✅ DELETE /strings/:string_value
router.delete("/:string_value", async (req, res) => {
  const deleted = await stringSchema.findOneAndDelete({ value: req.params.string_value });
  if (!deleted) return res.status(404).json({ error: "String not found" });
  res.status(200).json({ message: "Deleted successfully" });
});

export default router;
