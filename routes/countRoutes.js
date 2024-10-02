import express from "express";
import {
  getCountList,
  patchMyCount,
  patchComparedCount
} from "../controllers/countController.js";

const router = express.Router();

router.get("/companies/counts", getCountList);
router.patch("/companies/:id/my-chosen-count", patchMyCount);
router.patch("/companies/:id/compared-chosen-count", patchComparedCount);

export default router;
