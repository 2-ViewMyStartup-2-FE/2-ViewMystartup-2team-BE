import express from "express";
import {
  getInvestmentList,
  postInvestment
} from "../controllers/investmentController.js";

const router = express.Router();

router.get("/investments", getInvestmentList);
router.post("/companies/:id/investments", postInvestment);

export default router;
