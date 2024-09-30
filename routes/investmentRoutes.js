import express from "express";
import {
  getInvestmentList,
  getInvestment,
} from "../controllers/investmentController.js";

const router = express.Router();

router.get("/investments", getInvestmentList);
router.get("/investments/:id", getInvestment);

export default router;