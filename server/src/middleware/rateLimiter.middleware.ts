// SHOULD THIS REQUEST BE ALLOWED


import { Request, Response, NextFunction } from "express";
import redis from "../config/redis.js";

export const rateLimiter = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const apiKey = res.locals.apiKey;

        if (!apiKey) {
            return res.status(401).json({
                success: false,
                message: "API key information not found"
            });
        }

        const maxRequests = apiKey.rateLimit;
        const windowSize = apiKey.windowSize;

        const key = `rate_limit:${apiKey.key}`;

        const currentRequests = await redis.incr(key);

        if (currentRequests === 1) {
            await redis.expire(key, windowSize);
        }

        const remainingRequests = Math.max(
            0,
            maxRequests - currentRequests
        );

        res.setHeader(
            "X-RateLimit-Limit",
            maxRequests
        );

        res.setHeader(
            "X-RateLimit-Remaining",
            remainingRequests
        );

        if (currentRequests > maxRequests) {
            res.setHeader(
                "Retry-After",
                windowSize
            );

            return res.status(429).json({
                success: false,
                message: "Too many requests. Please try again later."
            });
        }

        next();

    } catch (error) {
        console.error("Rate limiter error:", error);

        next();
    }
};