// AUTHENTICATION OR IDENTIFICATION LAYER 


import { Request, Response, NextFunction } from "express";
import APIKey from "../models/APIKey.js";

export const apiKeyMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const apiKey = req.header("x-api-key");

        if (!apiKey) {
            return res.status(401).json({
                success: false,
                message: "API key is required"
            });
        }

        const keyData = await APIKey.findOne({
            key: apiKey,
            isActive: true
        });

        if (!keyData) {
            return res.status(403).json({
                success: false,
                message: "Invalid or inactive API key"
            });
        }

        // Attach API key information to the request
        res.locals.apiKey = keyData;

        next();
    } catch (error) {
        console.error("API key validation error:", error);

        res.status(500).json({
            success: false,
            message: "API key validation failed"
        });
    }
};