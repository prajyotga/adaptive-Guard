import { Request, Response, NextFunction } from "express";
import redis from "../config/redis.js";
import {
    getCachedAdaptiveDecision
} from "../services/adaptivePolicy.service.js";

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

        /*
         * Check whether ML has produced
         * an adaptive decision for this API key.
         */
        const adaptiveDecision = await getCachedAdaptiveDecision(
            apiKey.key
        );

        /*
         * HIGH risk
         * ML decision = BLOCK
         */
        if (adaptiveDecision === "BLOCK") {
            return res.status(403).json({
                success: false,
                message: "Request blocked by AdaptiveGuard",
                reason: "Anomalous traffic detected"
            });
        }

        /*
         * MEDIUM risk
         * ML decision = THROTTLE
         *
         * We temporarily reduce the allowed
         * requests to half of the normal limit.
         */
        const effectiveLimit =
            adaptiveDecision === "THROTTLE"
                ? Math.max(1, Math.floor(maxRequests / 2))
                : maxRequests;

        const key = `rate_limit:${apiKey.key}`;

        const currentRequests = await redis.incr(key);

        if (currentRequests === 1) {
            await redis.expire(key, windowSize);
        }

        const remainingRequests = Math.max(
            0,
            effectiveLimit - currentRequests
        );

        res.setHeader(
            "X-RateLimit-Limit",
            effectiveLimit
        );

        res.setHeader(
            "X-RateLimit-Remaining",
            remainingRequests
        );

        /*
         * Normal Redis rate limit check
         */
        if (currentRequests > effectiveLimit) {
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

        /*
         * Fail open:
         * if the adaptive system fails,
         * don't take the entire API down.
         */
        next();
    }
};