import { Request, Response } from "express";
import { analyzeTraffic } from "../services/ml.service.js";
import { getAdaptiveAction   } from "../services/adaptivePolicy.service.js";

export const testML = async (
    req: Request,
    res: Response
) => {
    try {
        const result = await analyzeTraffic({
            requests_per_minute: 12,
            average_response_time: 120,
            error_rate: 0.01,
            unique_ip_count: 5
        });

        const action = getAdaptiveAction(result.data);

        res.json({
            success: true,
            message: "ML service connected successfully",
            mlResult: result,
            adaptiveAction: action
        });

    } catch (error) {
        console.error("ML service error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to connect to ML service"
        });
    }
};

