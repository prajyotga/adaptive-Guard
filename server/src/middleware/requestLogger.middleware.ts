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

            await RequestLog.create({
                apiKey: apiKey?.key || "unknown",
                endpoint: req.originalUrl,
                method: req.method,
                statusCode: res.statusCode,
                responseTime,
                ip: req.ip || "unknown",
                timestamp: new Date()
            });

        } catch (error) {
            console.error("Request logging error:", error);
        }
    });

    next();
};