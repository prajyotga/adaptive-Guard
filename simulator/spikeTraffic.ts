import axios from "axios";

const API_URL = "http://localhost:5000/api/test";
const ANALYZE_URL = "http://localhost:5000/api/traffic/analyze";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is required");
}

const headers = {
    "x-api-key": API_KEY
};

const sendRequest = async (requestNumber: number) => {
    try {
        const response = await axios.get(API_URL, {
            headers
        });

        console.log(
            `Spike Request ${requestNumber} → ${response.status}`
        );

    } catch (error: any) {
        console.log(
            `Spike Request ${requestNumber} → ${
                error.response?.status || "ERROR"
            }`
        );
    }
};

const analyzeTraffic = async () => {
    try {
        const response = await axios.get(ANALYZE_URL, {
            headers
        });

        return response.data?.data;

    } catch (error: any) {
        console.error(
            "\nTraffic analysis failed:",
            error.response?.data || error.message
        );

        return null;
    }
};

const run = async () => {

    console.log("\n========================================");
    console.log("      AdaptiveGuard Spike Test");
    console.log("========================================\n");

    console.log("Generating traffic...\n");

    for (let i = 1; i <= 100; i++) {
        await sendRequest(i);
    }

    console.log("\nTraffic spike completed.");

    console.log("\nWaiting briefly for request logs...");
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("\nRunning AI traffic analysis...\n");

    const result = await analyzeTraffic();

    if (!result) {
        console.log("Could not analyze traffic.");
        return;
    }

    const features = result.features;
    const mlResult = result.mlResult?.data;

    console.log("========================================");
    console.log("          TRAFFIC ANALYSIS");
    console.log("========================================");

    console.log(
        `Requests/min        : ${features.requests_per_minute}`
    );

    console.log(
        `Average response    : ${features.average_response_time.toFixed(2)} ms`
    );

    console.log(
        `Error rate          : ${(features.error_rate * 100).toFixed(2)}%`
    );

    console.log(
        `Unique IPs          : ${features.unique_ip_count}`
    );

    console.log("\n========================================");
    console.log("              ML RESULT");
    console.log("========================================");

    console.log(
        `Anomaly detected    : ${mlResult?.is_anomaly}`
    );

    console.log(
        `Anomaly score       : ${mlResult?.anomaly_score}`
    );

    console.log(
        `Risk level          : ${mlResult?.risk_level}`
    );

    console.log(
        `Risk score          : ${mlResult?.risk_score}`
    );

    console.log(
        `Adaptive action     : ${mlResult?.action}`
    );

    console.log("\n========================================");
    console.log("               SUMMARY");
    console.log("========================================");

    console.log(
        `Traffic             : ${features.requests_per_minute} requests/min`
    );

    console.log(
        `Risk                : ${mlResult?.risk_level}`
    );

    console.log(
        `Decision            : ${mlResult?.action}`
    );

    console.log("\n========================================");
    console.log("              TEST COMPLETE");
    console.log("========================================\n");
};

run();