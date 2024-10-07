import express from "express";
import {
  getCompare,
  getCompareList,
  patchCompanyCompare,
  patchMyCompare,
} from "../controllers/compareController.js";

const router = express.Router();

router.get("/comparison", getCompareList);
router.get("/comparison/:id", getCompare);
router.patch("/comparison/:id/my-compare", patchMyCompare);
router.patch("/comparison/:ids/company-compare", patchCompanyCompare);

export default router;
