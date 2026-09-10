import { Request, Response } from "express";
import RequestLog from "../models/RequestLog.js";

export const getTrafficLogs = async (
    req: Request,
    res: Response
) => {
    try {
        const logs = await RequestLog
            .find()
            .sort({ timestamp: -1 })
            .limit(100);

        res.json({
            success: true,
            count: logs.length,
            data: logs
        });

    } catch (error) {
        console.error("Traffic logs error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch traffic logs"
        });
    }
};

export const getTrafficStats = async (
    req: Request,
    res: Response
) => {
    try {
        const totalRequests = await RequestLog.countDocuments();

        const successfulRequests = await RequestLog.countDocuments({
            statusCode: { $gte: 200, $lt: 300 }
        });

        const clientErrors = await RequestLog.countDocuments({
            statusCode: { $gte: 400, $lt: 500 }
        });

        const serverErrors = await RequestLog.countDocuments({
            statusCode: { $gte: 500 }
        });

        const averageResponseTime = await RequestLog.aggregate([
            {
                $group: {
                    _id: null,
                    average: { $avg: "$responseTime" }
                }
            }
        ]);

        const topEndpoints = await RequestLog.aggregate([
            {
                $group: {
                    _id: "$endpoint",
                    requests: { $sum: 1 }
                }
            },
            {
                $sort: {
                    requests: -1
                }
            },
            {
                $limit: 10
            }
        ]);

        const requestsPerMinute = await RequestLog.aggregate([
    {
        $group: {
            _id: {
                year: { $year: "$timestamp" },
                month: { $month: "$timestamp" },
                day: { $dayOfMonth: "$timestamp" },
                hour: { $hour: "$timestamp" },
                minute: { $minute: "$timestamp" }
            },
            requests: { $sum: 1 }
        }
    },
    {
        $sort: {
            "_id.year": 1,
            "_id.month": 1,
            "_id.day": 1,
            "_id.hour": 1,
            "_id.minute": 1
        }
    },
    {
        $limit: 60
    }
]);


        res.json({
            success: true,
            data: {
                totalRequests,
                successfulRequests,
                clientErrors,
                serverErrors,
                averageResponseTime:
                    averageResponseTime[0]?.average || 0,
                topEndpoints,
                requestsPerMinute
            }
        });

    } catch (error) {
        console.error("Traffic statistics error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to calculate traffic statistics"
        });
    }
};