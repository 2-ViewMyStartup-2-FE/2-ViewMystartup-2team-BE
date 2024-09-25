import express from "express";
//수정해서 사용
import { getExample, createExample } from "../controllers/exampleController.js";

const router = express.Router();

//수정해서 사용
router.get("/", getExample);
router.post("/", createExample);

export default router;
