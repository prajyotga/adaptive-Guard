import { Router } from "express";
import {
    createAPIKey,
    updateRateLimit
} from "../controllers/apiKey.controller.js";

const router = Router();

router.post("/", createAPIKey);

router.patch("/:key/rate-limit", updateRateLimit);

export default router;