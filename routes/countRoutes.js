import express from "express";
import {
  getCountList,
  putMyCount,
  putComparedCount,
} from "../controllers/countController.js";

const router = express.Router();

router.get("/companies/counts", getCountList);
router.patch("/companies/:id/my-chosen-count", putMyCount);
router.patch("/companies/:id/compared-chosen-count", putComparedCount);

export default router;
