import { Registry, Counter, Histogram } from "prom-client";
import type { Request, Response, NextFunction } from "express";

export const register = new Registry();

register.setDefaultLabels({
    app: "adaptiveguard"
});

export const totalRequests = new Counter({
    name: "http_requests_total",
    help: "Total HTTP requests",
    labelNames: ["method", "route", "status"],
    registers: [register]
});

export const requestDuration = new Histogram({
    name: "http_request_duration_seconds",
    help: "HTTP request duration in seconds",
    labelNames: ["method", "route"],
    registers: [register]
});

export const metricsMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const start = process.hrtime.bigint();

    res.on("finish", () => {
        const route = req.route?.path
            ? `${req.baseUrl}${req.route.path}`
            : req.path;

        totalRequests.inc({
            method: req.method,
            route,
            status: String(res.statusCode)
        });

        requestDuration.observe(
            {
                method: req.method,
                route
            },
            Number(process.hrtime.bigint() - start) / 1e9
        );
    });

    next();
};