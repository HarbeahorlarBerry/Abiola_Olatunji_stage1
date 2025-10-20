import express from "express";
import { createString, getString, getAllString, deleteString } from "../Controllers/stringApis//stringController.js";


const router = express.Router();

router.post("/", createString);
router.get("/", getAllString);
router.get("/:string_value", getString);
router.delete("/:string_value", deleteString);

export default router;