import express from "express";
import {
  createString,
  getAllString,
  getString,
  deleteString,
  filterByNaturalLanguage,
} from "../Controllers/stringApis/stringController.js";

const router = express.Router();

router.post("/", createString);
router.get("/", getAllString);
router.get("/filter-by-natural-language", filterByNaturalLanguage);
router.get("/:string_value", getString);
router.delete("/:string_value", deleteString);

export default router;
