import express from "express";
import { getCountList } from "../controllers/countController.js";

const router = express.Router();

router.get("/companies/counts", getCountList);

export default router;
