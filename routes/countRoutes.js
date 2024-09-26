import express from "express";
import {
  getCountList,
  putMyCount,
  putComparedCount,
} from "../controllers/countController.js";

const router = express.Router();

router.get("/companies/counts", getCountList);
router.put("/companies/:id/my-chosen-count", putMyCount);
router.put("/companies/:id/compared-chosen-count", putComparedCount);

export default router;
