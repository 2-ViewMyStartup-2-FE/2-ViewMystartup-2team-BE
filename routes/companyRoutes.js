import express from "express";
import {
    getCompanyList,
    getCompany,
} from "../controllers/companyController.js";

const router = express.Router();

router.get("/companies", getCompanyList);
router.get("/companies/:id", getCompany);

export default router;