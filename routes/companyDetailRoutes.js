import express from "express";
import {
  getCompanyDetail,
  postInvestment,
  patchInvestment,
  deleteInvestment,
} from "../controllers/companyDetailController.js";

const router = express.Router();

router.get("/company/:id", getCompanyDetail);
router.post("/company/:id/investor", postInvestment);
router.patch("/investor/:id", patchInvestment);
router.delete("/investor/:id", deleteInvestment);

export default router;
