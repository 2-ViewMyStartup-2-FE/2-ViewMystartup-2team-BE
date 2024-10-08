import express from "express";
import {
  getCompanyDetail,
  patchInvestment,
  deleteInvestment,
} from "../controllers/companyDetailController.js";

const router = express.Router();

router.get("/companies/:id/investments", getCompanyDetail);
router.patch("/investments/:id", patchInvestment);
router.delete("/investments/:id", deleteInvestment);

export default router;
