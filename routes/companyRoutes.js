import express from "express";
import {
  getCompanyList,
  getCompany,
  getRankingNearByCompanies
} from "../controllers/companyController.js";

const router = express.Router();

router.get("/companies", getCompanyList);
router.get("/companies/:id", getCompany);
router.get("/companies/:id/rank", getRankingNearByCompanies);
export default router;
