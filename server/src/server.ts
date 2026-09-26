import express from "express";
import redis from "./config/redis.js";
import { rateLimiter } from "./middleware/rateLimiter.middleware.js";
import { apiKeyMiddleware } from "./middleware/apiKey.middleware.js";
import connectDB from "./config/db.js";
import apiKeyRoutes from "./routes/apiKey.route.js";
import { requestLogger } from "./middleware/requestLogger.middleware.js";
import trafficRoutes from "./routes/traffic.routes.js";
import mlRoutes from "./routes/ml.routes.js";
import cors from "cors";

const app = express();
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

const PORT = 5000;

app.use(express.json());
app.use(requestLogger);

app.use("/api/keys", apiKeyRoutes);
app.use("/api/traffic", trafficRoutes);
app.use("/api/ml", mlRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "AdaptiveGuard API is running!"
    });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    service: "adaptiveguard-server"
  });
});

app.get("/api/test",apiKeyMiddleware, rateLimiter, (req, res) => {
    res.json({
        success: true,
        message: "Request accepted!"
    });
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});