import redis from "../config/redis.js";

export type AdaptiveAction = "ALLOW" | "THROTTLE" | "BLOCK";

const ADAPTIVE_DECISION_TTL = 300;

interface MLResult {
    prediction: number;
    anomaly_score: number;
    is_anomaly: boolean;
    risk_level: string;
    action: string;
}

export const getAdaptiveAction = (
    mlResult: MLResult
): AdaptiveAction => {

    if (mlResult.risk_level === "HIGH") {
        return "BLOCK";
    }

    if (mlResult.risk_level === "MEDIUM") {
        return "THROTTLE";
    }

    return "ALLOW";
};

export const cacheAdaptiveDecision = async (
    apiKey: string,
    action: AdaptiveAction
) => {
    const key = `adaptive_decision:${apiKey}`;

    console.log("Caching adaptive decision:", action);

    await redis.set(
        key,
        action,
        "EX",
        ADAPTIVE_DECISION_TTL
    );

    console.log("Adaptive decision cached successfully");
};

export const getCachedAdaptiveDecision = async (
    apiKey: string
): Promise<AdaptiveAction | null> => {

    const key = `adaptive_decision:${apiKey}`;

    const decision = await redis.get(key);

    if (
        decision === "ALLOW" ||
        decision === "THROTTLE" ||
        decision === "BLOCK"
    ) {
        return decision;
    }

    return null;
};

