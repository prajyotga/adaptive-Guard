import { Router } from "express";
import { testML } from "../controllers/ml.controller.js";

const router = Router();

router.get("/test", testML);


export default router;