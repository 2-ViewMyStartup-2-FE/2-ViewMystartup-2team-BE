import express from "express";
import {
  getInvestmentList,
  getInvestment,
  postInvestment,
  deleteInvestment,
  patchInvestment,
} from "../controllers/investmentController.js";

const router = express.Router();

router.get("/investments", getInvestmentList);
router.get("/investments/:id", getInvestment);
router.post("/companies/:id/investments", postInvestment);
router.delete("/investments/:id", deleteInvestment);
router.patch("/investments/:id", patchInvestment);

export default router;
