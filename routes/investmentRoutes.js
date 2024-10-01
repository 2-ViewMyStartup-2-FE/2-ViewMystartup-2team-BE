import express from "express";
import {
  getInvestmentList,
  getInvestment,
  putInvestment,
} from "../controllers/investmentController.js";

const router = express.Router();

router.get("/investments", getInvestmentList);
router.get("/investments/:id", getInvestment);
router.put("/investments/:id", putInvestment);

export default router;