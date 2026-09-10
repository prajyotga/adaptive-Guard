// TO CREATE APIKEY AND UPDATE RATELIMIT

import { Request, Response } from "express";
import crypto from "crypto";
import APIKey from "../models/APIKey.js";

export const createAPIKey = async (
    req: Request,
    res: Response
) => {
    try {
        const key = `ag_${crypto.randomBytes(24).toString("hex")}`;

        const apiKey = await APIKey.create({
            key,
            name: "Test Application",
            rateLimit: 5,
            windowSize: 60,
            isActive: true
        });

        res.status(201).json({
            success: true,
            message: "API key created successfully",
            apiKey: {
                id: apiKey._id,
                key: apiKey.key,
                name: apiKey.name,
                rateLimit: apiKey.rateLimit,
                windowSize: apiKey.windowSize
            }
        });
    } catch (error) {
        console.error("API key creation error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create API key"
        });
    }
};

// to cahnge or update rate limit

export const updateRateLimit = async (
    req: Request,
    res: Response
) => {
    try {
        const { key } = req.params;
        const { rateLimit, windowSize } = req.body;

        if (!rateLimit || !windowSize) {
            return res.status(400).json({
                success: false,
                message: "rateLimit and windowSize are required"
            });
        }

        const apiKey = await APIKey.findOneAndUpdate(
            { key },
            {
                rateLimit,
                windowSize
            },
            { new: true }
        );

        if (!apiKey) {
            return res.status(404).json({
                success: false,
                message: "API key not found"
            });
        }

        res.json({
            success: true,
            message: "Rate limit updated successfully",
            apiKey: {
                key: apiKey.key,
                rateLimit: apiKey.rateLimit,
                windowSize: apiKey.windowSize
            }
        });

    } catch (error) {
        console.error("Rate limit update error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update rate limit"
        });
    }
};