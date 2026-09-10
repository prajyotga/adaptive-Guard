import { Router } from "express";
import {
    getTrafficLogs,
    getTrafficStats
} from "../controllers/traffic.controller.js";

const router = Router();

router.get("/", getTrafficLogs);
router.get("/stats", getTrafficStats);

export default router;