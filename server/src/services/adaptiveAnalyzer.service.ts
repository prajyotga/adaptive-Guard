import RequestLog from "../models/RequestLog.js";
import { analyzeTraffic } from "./ml.service.js";
import {
    cacheAdaptiveDecision
} from "./adaptivePolicy.service.js";

export const analyzeRecentTraffic = async (
    apiKey: string
) => {
    try {
        const oneMinuteAgo = new Date(
            Date.now() - 60 * 1000
        );

        const logs = await RequestLog.find({
            apiKey,
            timestamp: {
                $gte: oneMinuteAgo
            }
        });

        const totalRequests = logs.length;

        const averageResponseTime =
            totalRequests > 0
                ? logs.reduce(
                      (sum, log) => sum + log.responseTime,
                      0
                  ) / totalRequests
                : 0;

        const errorRequests = logs.filter(
            (log) => log.statusCode >= 400
        ).length;

        const errorRate =
            totalRequests > 0
                ? errorRequests / totalRequests
                : 0;

        const uniqueIpCount = new Set(
            logs.map((log) => log.ip)
        ).size;

        const mlResult = await analyzeTraffic({
            requests_per_minute: totalRequests,
            average_response_time: averageResponseTime,
            error_rate: errorRate,
            unique_ip_count: uniqueIpCount
        });

        await cacheAdaptiveDecision(
            apiKey,
            mlResult.data.action as "ALLOW" | "THROTTLE" | "BLOCK"
        );

        return {
            features: {
                requests_per_minute: totalRequests,
                average_response_time: averageResponseTime,
                error_rate: errorRate,
                unique_ip_count: uniqueIpCount
            },
            mlResult
        };
    } catch (error) {
        console.error(
            "Adaptive traffic analysis error:",
            error
        );

        throw error;
    }
};