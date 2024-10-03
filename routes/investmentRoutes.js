import express from "express";
import {
  getInvestmentList,
  getInvestment,
  patchInvestment,
  postInvestment
} from "../controllers/investmentController.js";

const router = express.Router();

router.get("/investments", getInvestmentList);
router.get("/investments/:id", getInvestment);
router.patch("/investments/:id", patchInvestment);
router.post("/companies/:id/investments", postInvestment);

export default router;
