import { Request, Response, NextFunction } from "express";
import RequestLog from "../models/RequestLog.js";

export const requestLogger = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const startTime = Date.now();

    res.on("finish", async () => {
        try {
            const responseTime = Date.now() - startTime;
            const apiKey = res.locals.apiKey;

            const saved = await RequestLog.create({
                apiKey: apiKey?.key || req.header("x-api-key") || "unknown",
                endpoint: req.originalUrl,
                method: req.method,
                statusCode: res.statusCode,
                responseTime,
                ip: req.ip || "unknown",
                timestamp: new Date()
            });

            console.log("RequestLog saved:", saved.apiKey, saved.statusCode);
        } catch (error) {
            console.error("RequestLog save failed:", error);
        }
    });

    next();
};