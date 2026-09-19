import { Router } from "express";
import {
    getTrafficLogs,
    getTrafficStats,
      analyzeTraffic
} from "../controllers/traffic.controller.js";

const router = Router();

router.get("/", getTrafficLogs);
router.get("/stats", getTrafficStats);
router.get("/analyze", analyzeTraffic);

export default router;