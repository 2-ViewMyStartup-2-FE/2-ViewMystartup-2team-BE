import express from "express";
import {
  getCompanyDetail,
  postInvestment,
  patchInvestment,
  deleteInvestment,
} from "../controllers/companyDetailController.js";

const router = express.Router();

router.get("/companies2/:id", getCompanyDetail);
router.post("/companies2/:id/investments", postInvestment);
router.patch("/investments/:id", patchInvestment);
router.delete("/investments/:id", deleteInvestment);

export default router;
