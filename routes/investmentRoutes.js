import express from "express";
import {
  getInvestmentList,
  getInvestment,
  patchInvestment,
} from "../controllers/investmentController.js";

const router = express.Router();

router.get("/investments", getInvestmentList);
router.get("/investments/:id", getInvestment);
router.patch("/investments/:id", patchInvestment);

export default router;